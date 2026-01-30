using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;
using BookMyFlight.Backend.Services;
using BookMyFlight.Backend.Models;

namespace BookMyFlight.Backend.Controllers
{
    [ApiController]
    [Route("book")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookService;
        private readonly IFlightService _flightService;

        public BookingController(IBookingService bookService, IFlightService flightService)
        {
            _bookService = bookService;
            _flightService = flightService;
        }

        // Post requset for add booking
        [HttpPost("booking")]
        public ActionResult<string> AddBooking([FromBody] Booking booking, [FromQuery] int fid, 
            [FromQuery] string source, [FromQuery] string destination, [FromQuery] string date)
        {
            try
            {
                // Flight flight = flightservice.fetchFlight(source, destination, LocalDate.parse(date));
                // Java code commented out fetchFlight by details and used fetchById(fid).
                // I will follow the active code.
                
                Flight flight = _flightService.FetchById(fid);
                if (flight == null) // Should check null logic if service doesn't throw
                {
                    // Service logic implies ! null return in my implementation, or throw.
                    // If FetchById throws NRE (from my ! impl), this catches generic Exception? 
                    // No, implementation above throws NullReferenceException if not found generally.
                    // But lets assume it returns.
                    // Wait, logic:
                    // flight.getAvailableSeats() will throw if flight is null.
                    // Java Code: `Flight flight = flightservice.fetchById(fid);` followed strictly by access.
                    // I will do same.
                }

                if (flight!.AvailableSeats <= 0)
                {
                    return "Seats are not available";
                }
                else if (booking.NumberOfSeatsToBook > flight.AvailableSeats)
                {
                    return "Only " + flight.AvailableSeats + " are Available";
                }
                else
                {
                    flight.AvailableSeats = flight.AvailableSeats - booking.NumberOfSeatsToBook;
                    _flightService.UpdateFlight(flight);
                    booking.Flight = flight;
                    booking.BookingDate = DateOnly.FromDateTime(DateTime.Now); // LocalDate.now()
                    int bid = _bookService.AddBooking(booking);
                    return "" + bid;
                }
            }
            catch (Exception ex)
            {
                string message = ex.Message;
                if (ex.InnerException != null)
                {
                    message += " Inner Exception: " + ex.InnerException.Message;
                }
                Console.WriteLine("BOOKING ERROR: " + message);
                return BadRequest(message);
            }
        }

        // Post request for adding passengers for booking id
        [HttpPost("passenger/{bid}")]
        public IActionResult AddPassengers([FromBody] ListPassenger pass1, [FromRoute] int bid)
        {
            if (pass1 == null || pass1.Pass1 == null)
            {
                return BadRequest("Passenger list is empty");
            }

            Booking booking = _bookService.GetBookingById(bid);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            string s1 = "";
            for (int i = 0; i < booking.NumberOfSeatsToBook; i++)
            {
                if (i < pass1.Pass1.Count)
                {
                    s1 += " : " + _bookService.AddPassenger(pass1.Pass1[i], bid);
                }
            }
            return Ok("Passengers added with id's " + s1);
        }




        // Post request for generating ticket for user id and booking id
        [HttpPost("ticket/{userId}/{bookid}/{pay}")]
        public IActionResult CreateBookingTicket([FromBody] Ticket ticket, [FromRoute] int userId, [FromRoute] int bookid, [FromRoute] int pay)
        {
            Booking booking = _bookService.GetBookingById(bookid);
            booking.PayStatus = pay;
            _bookService.UpdateBooking(booking);

            int pay_status = booking.PayStatus;
            // Booking.Flight might be null if lazy loaded? In Repo I added Include(Flight).
            // Java Lazy? But accessed `booking.getFlight().getPrice()`.
            // So I included it in Repo.
            double total_pay = booking.Flight!.Price * booking.NumberOfSeatsToBook;

            if (pay_status == 1)
            {
                DateOnly date = DateOnly.FromDateTime(DateTime.Now);
                ticket.Booking_date = date; // naming kept
                ticket.Total_pay = total_pay;
                Ticket ticket1 = _bookService.GenerateTicket(ticket, userId, bookid);
                return Ok(ticket1);
            }
            else
            {
                return NotFound("Payment failed, please book ticket again.");
            }
        }

        // Get request for fetching tickets for user
        [HttpGet("getTickets/{uid}")]
        public List<Ticket> GetAllTickets([FromRoute] int uid)
        {
            _bookService.GetTicket(uid); // Redundant call in Java too?
            return _bookService.GetTicket(uid);
        }
    }
}
