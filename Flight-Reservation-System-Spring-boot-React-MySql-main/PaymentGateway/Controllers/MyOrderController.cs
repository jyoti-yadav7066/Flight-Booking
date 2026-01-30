using Microsoft.AspNetCore.Mvc;
using PaymentGetway.Models;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PaymentGetway.Controllers
{
    public class MyOrderController : Controller
    {
        [BindProperty]
        public EntityOrder _OrderDetails { get; set; }

        // STEP 1: Landing page (called from backend with query params)
        [HttpGet]
        public IActionResult Index()
        {
            var model = new EntityOrder
            {
                Name = string.IsNullOrEmpty(Request.Query["name"]) ? "N/A" : Request.Query["name"],
                Email = string.IsNullOrEmpty(Request.Query["email"]) ? "N/A" : Request.Query["email"],
                Mobile = string.IsNullOrEmpty(Request.Query["mobile"]) ? "N/A" : Request.Query["mobile"],
                Amount = string.IsNullOrEmpty(Request.Query["amount"])
                            ? 0
                            : Convert.ToDecimal(Request.Query["amount"]),
                Id = Request.Query["bookingId"],   // using Id as Booking ID
                UserId = string.IsNullOrEmpty(Request.Query["userId"]) ? 0 : Convert.ToInt32(Request.Query["userId"])
            };

            return View(model);
        }


        // STEP 2: Create Razorpay Order (NEW every time)
        [HttpPost("createorder")]
        public IActionResult CreateOrder()
        {
            string key = "rzp_test_S8p5Gc7pIh86oW";
            string secret = "SaglgWuJ6L1V1fu51BpZq5m2";

            RazorpayClient client = new RazorpayClient(key, secret);

            Dictionary<string, object> options = new Dictionary<string, object>();
            options.Add("amount", Convert.ToInt32(_OrderDetails.Amount) * 100); // paise
            options.Add("currency", "INR");
            options.Add("receipt", Guid.NewGuid().ToString());

            Razorpay.Api.Order order = client.Order.Create(options);

            // 🔥 SAVE USER DATA FOR PAYMENT CALLBACK
            TempData["OrderData"] = JsonSerializer.Serialize(_OrderDetails);

            ViewBag.Key = key;
            ViewBag.OrderId = order["id"].ToString();
            ViewBag.Amount = options["amount"];

            return View("Payment", _OrderDetails);
        }

        // STEP 3: Razorpay callback & verification
        [HttpPost]
        public async Task<IActionResult> Payment(
            string razorpay_payment_id,
            string razorpay_order_id,
            string razorpay_signature)
        {
            try
            {
                RazorpayClient client = new RazorpayClient(
                    "rzp_test_S8p5Gc7pIh86oW",
                    "SaglgWuJ6L1V1fu51BpZq5m2"
                );

                Dictionary<string, string> attributes = new Dictionary<string, string>();
                attributes.Add("razorpay_payment_id", razorpay_payment_id);
                attributes.Add("razorpay_order_id", razorpay_order_id);
                attributes.Add("razorpay_signature", razorpay_signature);

                Utils.verifyPaymentSignature(attributes);

                // 🔥 RESTORE USER DATA
                string json = TempData["OrderData"] as string;
                EntityOrder order =
                    JsonSerializer.Deserialize<EntityOrder>(json);

                order.TransactionId = razorpay_payment_id;
                order.OrderId = razorpay_order_id;

                // 🔥 NOTIFY MAIN BACKEND TO GENERATE TICKET
                using (var httpClient = new HttpClient())
                {
                    var ticketData = new { ticketNumber = 0, booking_date = (string)null, total_pay = 0 };
                    var content = new StringContent(JsonSerializer.Serialize(ticketData), Encoding.UTF8, "application/json");
                    
                    // URL: http://localhost:8980/book/ticket/{userId}/{bookid}/{pay}
                    var response = await httpClient.PostAsync($"http://localhost:8980/book/ticket/{order.UserId}/{order.Id}/1", content);
                    
                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Failed to generate ticket in backend: " + await response.Content.ReadAsStringAsync());
                    }
                }

                return View("PaymentSuccess", order);
            }
            catch (Exception ex)
            {
                return Content("Payment Failed or Signature Invalid: " + ex.Message);
            }
        }
    }
}
