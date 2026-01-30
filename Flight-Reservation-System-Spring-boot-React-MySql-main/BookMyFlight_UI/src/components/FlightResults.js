import React, { Component } from 'react';
import FlightList from './FlightList';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import planeBG from "../assets/images/planebg1.jpg";

class FlightResults extends Component {
    constructor(props) {
        super(props);
        // Get flights from location state
        this.flights = this.props.location.state ? this.props.location.state.flights : [];
    }

    render() {
        return (
            <div className="pt-5">
                <Header />
                <div className="py-5" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${planeBG})`,
                    backgroundSize: 'cover',
                    minHeight: '80vh'
                }}>
                    <div className="container mt-5">
                        <div className="bg-white p-3 rounded shadow-sm mb-4 border-start border-4 border-primary">
                            <h5 className="mb-0">
                                Searching: <span className="text-primary">{this.props.location.state?.source || 'Any'}</span> to <span className="text-primary">{this.props.location.state?.destination || 'Any'}</span> on <span className="text-primary">{this.props.location.state?.date || 'Selected Date'}</span>
                            </h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold text-dark">Available Flights</h2>
                            <button className="btn btn-outline-primary" onClick={() => this.props.history.push('/')}>
                                Change Search
                            </button>
                        </div>

                        {this.flights && this.flights.length > 0 ? (
                            <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
                                <div className="card-body p-0">
                                    <FlightList flights={this.flights} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <div className="display-4 mb-3">✈️</div>
                                <h3>No flights found for your search.</h3>
                                <p className="text-muted">Please try different dates or locations.</p>
                                <button className="btn btn-primary mt-3" onClick={() => this.props.history.push('/')}>
                                    Go Back to Search
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(FlightResults);
