using Microsoft.AspNetCore.Mvc;
using PaymentGetway.Models;
using Razorpay.Api;
using System;
using System.Collections.Generic;

namespace PaymentGetway.Controllers
{
    public class MyOrderController : Controller
    {
        [BindProperty]
        public EntityOrder _OrderDetails { get; set; }

        // STEP 1: Booking / Amount Page
        public IActionResult Index()
        {
            return View();
        }

        // STEP 2: CREATE ORDER (NEW ORDER_ID EVERY TIME)
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

            ViewBag.Key = key;
            ViewBag.OrderId = order["id"].ToString();
            ViewBag.Amount = options["amount"];

            return View("Payment", _OrderDetails);
        }

        // STEP 3: PAYMENT VERIFICATION
        [HttpPost]
        public IActionResult Payment(
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

                EntityOrder order = new EntityOrder
                {
                    Name = _OrderDetails.Name,
                    Email = _OrderDetails.Email,
                    Mobile = _OrderDetails.Mobile,
                    Amount = _OrderDetails.Amount,
                    TransactionId = razorpay_payment_id,
                    OrderId = razorpay_order_id
                };

                return View("PaymentSuccess", order);
            }
            catch
            {
                return Content("Payment Failed or Signature Invalid");
            }
        }
    }
}
