import React, { Component } from 'react';
import FlightList from './FlightList';
import { withRouter } from 'react-router-dom';
import FlightServiceRest from '../services/FlightServiceRest';
import search from '../assets/logo/magnifying-glass.png';

/**
 * 
 * This component searches flight based on source, destibnation and date
 * FlightServiceRest: Service for fetching flights
 */
class SearchFlight extends Component {
    constructor(props) {
        super(props);
        this.service = new FlightServiceRest();
        this.flag = false
        this.state = {
            source: "Chennai",
            destination: "Chennai",
            travelDate: "",
            searched: false
        }
    }

    componentDidMount() {
        this.setState({
            searched: false
        })
    }

    handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    /**
     * This method interact with service to fetch flights details
     */
    getFlightsList = (e) => {
        e.preventDefault();
        if (!e.target.closest("form").reportValidity()) {
            return;
        }


        this.setState({
            searched: false
        });

        const s = this.state.source;
        const d = this.state.destination;
        const t = this.state.travelDate;

        console.log(`Searching for: ${s} -> ${d} on ${t}`);
        this.service.getFlightsForUser(s, d, t).then(data => {
            console.log("Response data:", data);
            if (data && data.length > 0) {
                // Filter out flights that have already departed if searching for today
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const localTodayStr = `${year}-${month}-${day}`;

                if (t === localTodayStr) {
                    const currentHours = now.getHours();
                    const currentMinutes = now.getMinutes();
                    const currentSeconds = now.getSeconds();
                    const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

                    data = data.filter(flight => {
                        if (!flight.departureTime) return true;
                        const [fHours, fMinutes, fSeconds] = flight.departureTime.split(':').map(Number);
                        const flightTimeInSeconds = fHours * 3600 + fMinutes * (fMinutes ? 60 : 0) + (fSeconds ? fSeconds : 0);
                        return flightTimeInSeconds > currentTimeInSeconds;
                    });
                }

                if (data.length > 0) {
                    this.props.history.push({
                        pathname: '/search-results',
                        state: {
                            flights: data,
                            source: s,
                            destination: d,
                            date: t
                        }
                    });
                } else {
                    alert('No more flights available for today!!');
                }
            }

            else {
                alert('No Flights Found!!')
            }
            // console.log(this.state.flights);
        }).catch(error => {
            console.error("Flight search error:", error);
            alert('Flight search failed: ' + error.message);
        })
    }

    render() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const localTodayStr = `${year}-${month}-${day}`;
        return (

            <div className="container-fluid p-4 m-3">
                <h2 style={styling.heading}>Search for flights</h2>
                <form className="form-inline">
                    <div className="input-group mb-2 mr-sm-2">
                        {/* <!-- Drop down for source --> */}
                        <select className="custom-select my-1 mr-sm-2" id="source" name="source" onChange={this.handleInput} required>
                            <option value="Chennai">Chennai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Goa">Goa</option>
                            <option value="Pune">Pune</option>
                            <option value="Jaipur">Jaipur</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Cochin">Cochin</option>
                            <option value="Ahmadabad">Ahmadabad</option>
                        </select>
                    </div>
                    {/* <!-- Drop down for destination --> */}
                    <div className="input-group mb-2 mr-sm-2">
                        <select className="custom-select my-1 mr-sm-2" name="destination" onChange={this.handleInput} required>
                            <option value="Chennai">Chennai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Goa">Goa</option>
                            <option value="Pune">Pune</option>
                            <option value="Jaipur">Jaipur</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Cochin">Cochin</option>
                            <option value="Ahmadabad">Ahmadabad</option>
                        </select>
                    </div>

                    <div className="input-group mb-2 mr-sm-2">
                        <input className="my-1 p-2 border border-darken-2 rounded" type="date" value={this.state.travelDate}
                            name="travelDate" min={localTodayStr} onChange={this.handleInput} required />
                    </div>
                    <button type="submit" onClick={this.getFlightsList} className="btn mb-2 mr-sm-2" style={styling.icon}>
                        <img src={search} height="25" />
                    </button>
                </form>
            </div>
        );
    }
}

let styling = {
    heading: {
        color: "#333333",
        fontFamily: "Verdana",
        marginBottom: 20
    },
    icon: {

    }
}

export default withRouter(SearchFlight);