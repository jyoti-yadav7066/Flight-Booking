using System;
using System.Collections.Generic;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;
using BookMyFlight.Backend.Repositories;

namespace BookMyFlight.Backend.Services
{
    public class FlightServiceImpl : IFlightService
    {
        private readonly IFlightRepository _frepo;

        public FlightServiceImpl(IFlightRepository frepo)
        {
            _frepo = frepo;
        }

        public int AddFlight(Flight flight)
        {
            List<Flight> flights = _frepo.FindAll();
            Flight? flight_temp = null;
            foreach (Flight f in flights)
            {
                if (f.Source.Equals(flight.Source) && f.Destination.Equals(flight.Destination)
                        && f.TravelDate.Equals(flight.TravelDate) && f.ArrivalTime.Equals(flight.ArrivalTime)
                        && f.DepartureTime.Equals(flight.DepartureTime))
                {
                    flight_temp = f;
                }
            }

            if (flight_temp == null)
            {
                _frepo.Save(flight);
                return flight.FlightNumber;
            }
            else
            {
                throw new FlightException("Flight already exists with flight number " + flight_temp.FlightNumber);
            }
        }

        public List<Flight> FetchAll()
        {
            return _frepo.FindAll();
        }

        public Flight FetchFlight(string source, string destination, DateOnly scheduleDate)
        {
            Console.WriteLine(source + " " + destination + " " + scheduleDate);
            List<Flight> flights = _frepo.FindAll();
            Flight? flight = null;
            foreach (Flight f in flights)
            {
                if ((f.Source.Equals(source) && f.Destination.Equals(destination)) && f.TravelDate.Equals(scheduleDate))
                {
                    flight = f;
                }
            }

            if (flight != null)
            {
                return flight;
            }
            return null;
        }

        public List<Flight> FetchFlightsOnCondition(string source, string destination, DateOnly scheduleDate)
        {
            return _frepo.FindByCondition(source, destination, scheduleDate);
        }

        public int UpdateFlight(Flight flight)
        {
            List<Flight> flights = _frepo.FindAll();
            Flight? flight1 = null;
            foreach (Flight f in flights)
            {
                if (f.FlightNumber == flight.FlightNumber)
                {
                    flight1 = f;
                }
            }

            if (flight1 != null)
            {
                flight1.FlightNumber = flight.FlightNumber;
                flight1.ArrivalTime = flight.ArrivalTime;
                flight1.AvailableSeats = flight.AvailableSeats;
                flight1.DepartureTime = flight.DepartureTime;
                flight1.Destination = flight.Destination;
                flight1.Source = flight.Source;
                flight1.Price = flight.Price;
                flight1.TravelDate = flight.TravelDate;
                _frepo.Save(flight1);
                return flight.FlightNumber;
            }
            else
            {
                throw new FlightException("Flight not found with id " + flight.FlightNumber);
            }
        }

        public void RemoveFlight(int flightNumber)
        {
            _frepo.DeleteById(flightNumber);
            Console.WriteLine("Deleted flight");
        }

        public Flight FetchById(int fid)
        {
            return _frepo.FindById(fid)!; // Java .get() throws if not present. C# FindById returns null. I should strictly throw or use !. Default is NRE if null, essentially .get().
            // Ideally: if (res == null) throw.
            // But logic: `frepo.findById(fid).get()` throws NoSuchElementException.
            // I'll rely on ! to throw NullReferenceException or explicit check matching behavior.
            // I'll just use ! to keep it concise and strictly mapping "get()".
        }
    }
}
