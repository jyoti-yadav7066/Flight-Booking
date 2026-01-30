

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../assets/css/TicketStyle.css'
import ReactToPrint from 'react-to-print'
import planeBG from "../assets/images/planebg1.jpg";
import Footer from './Footer';
import Header from './Header';
import { send } from 'emailjs-com';
import BookingService from '../services/BookingService';

class Ticket extends Component {

    constructor(props) {
        super(props)

        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            if (localStorage.getItem('ticket') !== null) {
                this.ticket = JSON.parse(localStorage.getItem('ticket'))
                this.airplane = JSON.parse(localStorage.getItem('plane'))
            } else if (localStorage.getItem('view-ticket') !== null) {
                this.ticket = JSON.parse(localStorage.getItem('view-ticket'))
                localStorage.removeItem('view-ticket')
            }
        }

        this.passengers = this.ticket?.booking?.passengers || []
    }

    async componentDidMount() {
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
            return;
        }

        // If ticket is missing (e.g. redirected from payment), try to fetch the latest one
        if (!this.ticket) {
            const service = new BookingService();
            try {
                const response = await service.getTickets();
                if (response.data && response.data.length > 0) {
                    // Sorting by ticket number or date might be better, but usually last one is latest
                    const latestTicket = response.data[response.data.length - 1];
                    this.ticket = latestTicket;
                    this.passengers = latestTicket.booking.passengers;
                    this.forceUpdate(); // Force re-render with new data
                }
            } catch (err) {
                console.error("Failed to fetch latest ticket:", err);
            }
        }
    }

    onMail = () => {
        if (!this.ticket?.booking?.flight) {
            alert("Cannot send email: Ticket details missing.");
            return;
        }

        let tosend = {
            from_name: 'BookMyFlight',
            to_name: JSON.parse(localStorage.getItem('user')).fname,
            message: 'Your ticket is Confirmed : ' + this.ticket.ticketNumber,
            source: this.ticket.booking.flight.source,
            destination: this.ticket.booking.flight.destination,
            travelDate: this.ticket.booking.flight.travelDate,
            reply_to: JSON.parse(localStorage.getItem('user')).email,
        }

        send(
            'service_enui0by',
            'template_xkbuxqd',
            tosend,
            'user_yzrYhjB6DwK4wPq69r043'
        )
            .then(() => alert('Ticket emailed successfully'))
            .catch(() => alert('Email failed'))
    }

    render() {
        if (!this.ticket) {
            return (
                <div className='pt-5 text-center'>
                    <Header />
                    <div className="container mt-5 py-5 text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <h3>Fetching your ticket details...</h3>
                        <p className="text-muted">Please wait while we confirm your booking.</p>
                    </div>
                    <Footer />
                </div>
            )
        }
        return (
            <div className='pt-3' >
                <Header />

                <div className="py-5"
                    style={{
                        backgroundImage: `url(${planeBG})`,
                        height: '700px'
                    }}>

                    <div style={{ textAlign: 'right', marginRight: '90pt', marginTop: '130pt' }}>
                        <ReactToPrint
                            trigger={() => <a className="btn text-light bg-dark">Print The Ticket</a>}
                            content={() => this.componentRef}
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginRight: '95pt', marginTop: '15pt' }}>
                        <button className='btn text-light bg-dark' onClick={this.onMail}>
                            Mail My Ticket
                        </button>
                    </div>

                    <div className="box pt-2" ref={el => this.componentRef = el}>
                        <div className="ticket">

                            <span className="airline">BookMyFlight</span>
                            <span className="boarding">
                                Boarding : {this.ticket?.booking?.flight?.source || 'N/A'}
                            </span>

                            <div className="content">
                                <span className="jfk">
                                    {this.ticket?.booking?.flight?.source || 'N/A'}
                                </span>

                                <span className="sfo">
                                    {this.ticket?.booking?.flight?.destination || 'N/A'}
                                </span>

                                <div className="sub-content">

                                    <span className="name">
                                        Passenger Name <br />
                                        {this.passengers.map(p => <span key={p.pid}>{p.pname}<br /></span>)}
                                    </span>

                                    <span className="age">
                                        Passenger Age <br />
                                        {this.passengers.map(p => <span key={p.pid}>{p.age}<br /></span>)}
                                    </span>

                                    <span className="gender">
                                        Passenger Gender <br />
                                        {this.passengers.map(p => <span key={p.pid}>{p.gender}<br /></span>)}
                                    </span>

                                    <span className="flight">
                                        Flight No <br />
                                        {this.ticket?.booking?.flight?.flightNumber || 'N/A'}
                                    </span>

                                    <span className="gate">
                                        Ticket No / Booking ID <br />
                                        {this.ticket?.ticketNumber || 'N/A'} / {this.ticket?.booking?.bookingId || 'N/A'}
                                    </span>

                                    <span className="amount">
                                        Amount Paid <br />
                                        ₹{this.ticket?.total_pay || 0}
                                    </span>

                                    {/* ✅ FIXED MAPPING */}
                                    <span className="boardingtime">
                                        Departure Time <br />
                                        {this.ticket?.booking?.flight?.departureTime || 'N/A'}
                                    </span>

                                    <span className="traveldate">
                                        Travel Date <br />
                                        {this.ticket?.booking?.flight?.travelDate || 'N/A'}
                                    </span>

                                    <span className="departuretime">
                                        Arrival Time <br />
                                        {this.ticket?.booking?.flight?.arrivalTime || 'N/A'}
                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}

export default withRouter(Ticket);
