using System.Collections.Generic;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Services
{
    public interface IBookingService
    {
        int AddBooking(Booking booking);
        int AddPassenger(Passenger passenger, int bookingId);
        Ticket GenerateTicket(Ticket ticket, int userId, int bookingId);
        List<Ticket> GetTicket(int uid);
        Booking GetBookingById(int bid);
        void UpdateBooking(Booking bookPay);
    }
}
