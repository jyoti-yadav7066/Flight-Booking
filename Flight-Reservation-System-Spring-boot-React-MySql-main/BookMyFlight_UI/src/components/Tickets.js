import React, { Component } from 'react';
import planeBG from "../assets/images/planebg1.jpg";
import Header from './Header';
import Footer from './Footer';
import BookingService from '../services/BookingService';

/**
 * 
 * this component renders list of tickets for a logged user
 * BookingService: Service for fetching tickets details from database
 */
class Tickets extends Component {
    state = { multiple_ticket: [] }
    constructor(props) {
        super(props)
        this.service = new BookingService();
        this.state = {
            multiple_ticket: []
        }
    }

    componentDidMount() {
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        }
        else {
            this.service.getTickets().then(response => {
                console.log("Tickets page : ", response)
                this.setState({ multiple_ticket: response.data || [] })
            }).catch(err => {
                console.error("Failed to fetch tickets:", err);
            });
        }
    }

    /** 
     * stores ticket in local storage and redirects to Ticket component
    */
    showTicket(x) {
        console.log(x)
        localStorage.setItem('view-ticket', JSON.stringify(x))
        this.props.history.push('/ticket')
    }

    render() {
        if (!this.state.multiple_ticket) { return null }

        const flightList = (this.state.multiple_ticket || []).map((x) =>

            <tr key={x.ticketNumber}>
                <td>{x.ticketNumber}</td>
                <td>{x.booking?.flight?.source || 'N/A'}</td>
                <td>{x.booking?.flight?.destination || 'N/A'}</td>
                <td>{x.booking?.flight?.travelDate || 'N/A'}</td>
                <td>{x.booking?.bookingDate || 'N/A'}</td>
                <td><button className="btn btn-outline-dark" onClick={() => this.showTicket(x)}>View Ticket</button></td>
            </tr>
        )

        return (
            <div className='pt-5'>
                <Header />

                <div className='pt-5' style={{ backgroundImage: `url(${planeBG})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', minHeight: '100vh', paddingBottom: '100px' }}>

                    <div className="row mb-4">
                        <div className="col-lg-12 mx-auto text-center">
                            <h1 className="display-6" style={{ color: 'white', fontWeight: '5pt' }}>My Bookings</h1>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-10 mx-auto">
                            <div className="card shadow">
                                <div className="card-header border-0 bg-white shadow-sm pt-4">
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active pt-3">
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead className="thead-dark">
                                                        <tr>
                                                            <th>Ticket Number</th>
                                                            <th>Source</th>
                                                            <th>Destination</th>
                                                            <th>Travel Date</th>
                                                            <th>Booking Date</th>
                                                            <th>Details</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {flightList}
                                                    </tbody>
                                                </table>
                                                {(!this.state.multiple_ticket || this.state.multiple_ticket.length === 0) && (
                                                    <div className="text-center py-5">
                                                        <h5>No bookings found.</h5>
                                                        <button className="btn btn-primary mt-3" onClick={() => this.props.history.push('/')}>Book a Flight Now</button>
                                                    </div>
                                                )}
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

export default Tickets;