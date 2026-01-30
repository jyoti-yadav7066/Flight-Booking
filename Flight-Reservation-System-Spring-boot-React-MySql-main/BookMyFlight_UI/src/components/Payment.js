import React, { Component } from 'react';
import amex from '../assets/images/amex.png';
import visa from '../assets/images/visa.png';
import mastercard from '../assets/images/mastercard.png';
import BookingService from '../services/BookingService';
import { withRouter } from "react-router";
import planeBG from "../assets/images/planebg1.jpg";
import Footer from './Footer';
import Header from './Header';

/**
 * 
 * this components renders payment page and validate input payment fields
 * BookingService: Using Service to generate ticket and updating pay status of booking 
 */
class Payment extends Component {

    constructor(props) {
        super(props)
        if (!localStorage.getItem('user')) { this.props.history.push('/login') }
        else {
            this.service = new BookingService();
            this.state = {
                ticketNumber: 0,
                booking_date: null,
                total_pay: 0,
                name: ''
            }
        }
    }

    /**
     * this method interacts with service to generate ticket for user
     * redirects to Ticket Component
     */
    createTicket = (e) => {
        e.preventDefault();
        if (!e.target.closest("form").reportValidity()) {
            return;
        }

        console.log(this.state.name)
        this.service.generateTicket(this.state).then(response => {

            if (response && response.status === 200) {
                this.props.history.push('/ticket')
            } else {
                alert("Payment failed or Booking not found. Please try again.");
            }
        }).catch(error => {
            console.log(error);
            const errorMsg = error.response && error.response.data && error.response.data.title
                ? error.response.data.title
                : (error.response && error.response.data ? JSON.stringify(error.response.data) : error.message);
            alert("An error occurred during payment processing: " + errorMsg);
        });
    }



    render() {
        if (!localStorage.getItem('user')) { return null }
        const currentMonth = new Date().toISOString().slice(0, 7);
        return (


            <div class='pt-5'>
                <Header />
                <div class="py-5" style={{ backgroundImage: `url(${planeBG})`, overflow: 'hidden', height: '800px' }}>
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
                                                        <div className="col-lg-12 text-center" >
                                                            <img src={visa} alt="visa card " />
                                                            <img src={mastercard} alt="mastercard" />
                                                            <img src={amex} alt="amex card" />
                                                        </div>
                                                    </div>
                                                    <br></br>
                                                    <div className="text-center">
                                                        <h5>Total Amount: ₹{localStorage.getItem('total_amount')}</h5>
                                                        <p>You will be redirected to our secure Razorpay gateway to complete the payment.</p>
                                                    </div>
                                                    <br></br>
                                                    <div className="card-footer">
                                                        <div className="col-md-12 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const user = JSON.parse(localStorage.getItem('user'));
                                                                    const bid = localStorage.getItem('bid');
                                                                    const amount = localStorage.getItem('total_amount');

                                                                    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8980";
                                                                    const paymentUrl = `${apiUrl}/MyOrder/Index?` +
                                                                        `bookingId=${bid}&` +
                                                                        `userId=${user.userId}&` +
                                                                        `amount=${amount}&` +
                                                                        `name=${encodeURIComponent(user.fname || user.username)}&` +
                                                                        `email=${encodeURIComponent(user.email)}&` +
                                                                        `mobile=${encodeURIComponent(user.phone || '0000000000')}`;

                                                                    window.location.href = paymentUrl;
                                                                }}
                                                                className="subscribe btn btn-primary btn-block shadow-sm">
                                                                Proceed to Pay
                                                            </button>
                                                        </div>
                                                    </div>
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