using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;
using BookMyFlight.Backend.Services;

namespace BookMyFlight.Backend.Controllers
{
    [ApiController]
    [Route("flight")]
    // [EnableTransactionManagement] -> Not needed in C#, DbContext handles transactions implicitly on SaveChanges 
    public class FlightController : ControllerBase
    {
        private readonly IFlightService _fservice;

        public FlightController(IFlightService fservice)
        {
            _fservice = fservice;
        }

        // Post request for adding flight
        [HttpPost("add")]
        public string AddFlight([FromBody] Flight flight) 
        {
            // HttpSession session argument removed as it was unused in Java body logic
            try
            {
                int id = _fservice.AddFlight(flight);
                return "Flight added with flight number " + id;
            }
            catch (FlightException e)
            {
                Console.WriteLine(e);
                return "" + e.Message;
            }
        }

        // Get request to fetch all the flights
        [HttpGet("fetchall")]
        public IEnumerable<Flight> SerachFlights() // Typo 'Serach' kept match Java
        {
            return _fservice.FetchAll();
        }

        // Get request for searching flight based on source, destination and date
        [HttpGet("fetch")]
        public IActionResult SearchFlight([FromQuery] string source, [FromQuery] string destination, [FromQuery] string date)
        {
            Console.WriteLine($"Search Request: Source={source}, Dest={destination}, Date={date}");
            try
            {
                DateOnly dt = DateOnly.Parse(date);
                IEnumerable<Flight> flights = _fservice.FetchFlightsOnCondition(source, destination, dt);
                return Ok(flights);
            }
            catch (FlightException e)
            {
                Console.WriteLine(e);
                return NotFound(e.Message);
            }
        }

        // Delete requset to remove flight
        [HttpDelete("remove/{fid}")]
        public string RemoveFlight([FromRoute] int fid)
        {
            // HttpSession session unused
            _fservice.RemoveFlight(fid);
            return "flight removed with id" + fid;
        }

        // Put request to update flight
        [HttpPut("update")]
        public string UpdateFlight([FromBody] Flight flight)
        {
            try
            {
                int id = _fservice.UpdateFlight(flight);
                return "Flight updated with id " + id;
            }
            catch (FlightException e)
            {
                Console.WriteLine(e);
                return "" + e.Message;
            }
        }
    }
}
