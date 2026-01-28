import React from "react";
import { withRouter } from "react-router-dom";
import "./SearchResults.css";

class SearchResults extends React.Component {

  calculateDuration = (f) => {
    const dep = new Date(`1970-01-01T${f.departureTime}`);
    const arr = new Date(`1970-01-01T${f.arrivalTime}`);
    let diff = arr - dep;
    if (diff < 0) diff += 24 * 60 * 60 * 1000;

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m`;
  };

  bookFlight = (flight) => {
    localStorage.setItem("plane", JSON.stringify(flight));
    this.props.history.push("/booking");
  };

  render() {
    const flights = JSON.parse(localStorage.getItem("searchResults")) || [];

    return (
      <div className="results-container">
        <h2>Available Flights</h2>

        {flights.map((f) => (
          <div className="flight-card" key={f.flightNumber}>

            <div className="flight-left">
              <h4>Flight {f.flightNumber}</h4>
              <p>{f.source} → {f.destination}</p>
            </div>

            <div className="flight-mid">
              <div>
                <strong>{f.departureTime}</strong>
                <p>Departure</p>
              </div>

              <div className="duration">
                <p>{this.calculateDuration(f)}</p>
                <hr />
              </div>

              <div>
                <strong>{f.arrivalTime}</strong>
                <p>Arrival</p>
              </div>
            </div>

            <div className="flight-right">
              <h3>₹ {f.price}</h3>
              <p>{f.availableSeats} seats left</p>
              <button onClick={() => this.bookFlight(f)}>
                Book Now
              </button>
            </div>

          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(SearchResults);
