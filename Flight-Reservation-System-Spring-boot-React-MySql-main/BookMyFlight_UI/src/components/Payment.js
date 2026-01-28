import React, { Component } from "react";
import amex from "../assets/images/amex.png";
import visa from "../assets/images/visa.png";
import mastercard from "../assets/images/mastercard.png";
import BookingService from "../services/BookingService";
import { withRouter } from "react-router";
import planeBG from "../assets/images/planebg1.jpg";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";

/**
 *
 * this components renders payment page and validate input payment fields
 * BookingService: Using Service to generate ticket and updating pay status of booking
 */
class Payment extends Component {
  constructor(props) {
    super(props);
    if (!localStorage.getItem("user")) {
      this.props.history.push("/login");
    } else {
      this.service = new BookingService();
      this.state = {
        ticketNumber: 0,
        booking_date: 0,
        total_pay: 0,
        name: "",
      };
    }
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }

  /**
   * this method interacts with service to generate ticket for user
   * redirects to Ticket Component
   */
  createTicket = () => {
    console.log(this.state.name);
    this.service.generateTicket(this.state).then((response) => {
      console.log(response.data);
      if (response.status === 200) this.props.history.push("/ticket");
    });
  };

  handlePayment = (e) => {
    e.preventDefault();
    // Redirect to .NET backend payment gateway
    window.location.href = "http://127.0.0.1:5000/";
  };

  render() {
    if (!localStorage.getItem("user")) {
      return null;
    }
    return (
      <div class="pt-5">
        <Header />
        <div
          class="py-5"
          style={{
            backgroundImage: `url(${planeBG})`,
            overflow: "hidden",
            height: "800px",
          }}
        >
          <div className="row mb-4">
            <div className="col-lg-8 mx-auto text-center">
              {/* <h1 className="display-6">Book My Flight</h1> */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mx-auto">
              <div className="card ">
                <div className="card-header">
                  <div className="bg-white shadow-sm pt-4 pl-2 pr-2 pb-2">
                    <div className="tab-content">
                      <div className="tab-pane fade show active pt-3">
                        <div className="container">
                          <h4 align="center">Confirm Payment</h4>
                          <br />

                          <div className="row">
                            <div className="col-md-6">
                              <span>
                                <h6>CREDIT/DEBIT CARD / UPI</h6>
                              </span>
                            </div>
                            <div
                              className="col-lg-6 text-right"
                              style={{ marginTop: "-5px" }}
                            >
                              {/* style="margin-top: -5px; */}
                              <img src={visa} alt="visa card " />
                              <img src={mastercard} alt="mastercard" />
                              <img src={amex} alt="amex card" />
                            </div>
                          </div>
                          <br></br>
                          <form>
                            {/* Removed Dummy Fields, integration is via Razorpay Popup */}
                            <div className="alert alert-info">
                              Click below to pay securely with Razorpay.
                            </div>

                            <div className="card-footer">
                              <div className="col-md-12 text-center">
                                <button
                                  type="button"
                                  onClick={this.handlePayment}
                                  className="subscribe btn btn-primary btn-block shadow-sm"
                                >
                                  {" "}
                                  Pay Now{" "}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Payment);
