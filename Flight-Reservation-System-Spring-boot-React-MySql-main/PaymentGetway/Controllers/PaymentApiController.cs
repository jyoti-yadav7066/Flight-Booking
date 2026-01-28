using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using PaymentGetway.Models;
using System.Collections.Generic;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PaymentGetway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentApiController : ControllerBase
    {
        private const string KEY = "rzp_test_S8p5Gc7pIh86oW";
        private const string SECRET = "SaglgWuJ6L1V1fu51BpZq5m2";
        private const string BACKEND_URL = "http://localhost:8980/book/confirmPayment"; 

        [HttpPost("createorder")]
        public IActionResult CreateOrder([FromBody] EntityOrder orderDetails)
        {
            try
            {
                RazorpayClient client = new RazorpayClient(KEY, SECRET);
                Dictionary<string, object> options = new Dictionary<string, object>();
                options.Add("amount", (int)(orderDetails.Amount * 100)); // paise
                options.Add("currency", "INR");
                options.Add("receipt", Guid.NewGuid().ToString());
                options.Add("payment_capture", 1);

                Order order = client.Order.Create(options);

                return Ok(new { 
                    orderId = order["id"].ToString(),
                    amount = options["amount"],
                    key = KEY
                });
            }
            catch (Exception ex)
            {
                return BadRequest("Error creating order: " + ex.Message);
            }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerificationModel model)
        {
            try
            {
                Dictionary<string, string> attributes = new Dictionary<string, string>();
                attributes.Add("razorpay_payment_id", model.PaymentId);
                attributes.Add("razorpay_order_id", model.OrderId);
                attributes.Add("razorpay_signature", model.Signature);

                Utils.verifyPaymentSignature(attributes);

                // Verification successful, notify Backend
                using (var httpClient = new HttpClient())
                {
                    var payload = new
                    {
                        bookingId = model.BookingId,
                        transactionId = model.PaymentId,
                        orderId = model.OrderId,
                        status = "SUCCESS"
                    };

                    var content = new StringContent( JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                    var response = await httpClient.PostAsync(BACKEND_URL, content);

                    if (response.IsSuccessStatusCode)
                    {
                        return Ok(new { status = "verified", message = "Payment verified and booking confirmed." });
                    }
                    else
                    {
                         return StatusCode(500, "Payment verified but Backend update failed.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Payment verification failed: " + ex.Message);
            }
        }
    }

    public class PaymentVerificationModel
    {
        public string OrderId { get; set; }
        public string PaymentId { get; set; }
        public string Signature { get; set; }
        public int BookingId { get; set; }
    }
}
