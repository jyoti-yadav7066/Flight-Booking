using System.Collections.Generic;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Repositories;

namespace BookMyFlight.Backend.Services
{
    public class BookingServiceImpl : IBookingService
    {
        private readonly IUserRepository _urepo;
        private readonly IBookingRepository _brepo;
        private readonly IPassengerRepository _prepo;
        private readonly ITicketRepository _trepo;

        public BookingServiceImpl(IUserRepository urepo, IBookingRepository brepo, IPassengerRepository prepo, ITicketRepository trepo)
        {
            _urepo = urepo;
            _brepo = brepo;
            _prepo = prepo;
            _trepo = trepo;
        }

        public int AddBooking(Booking booking)
        {
            _brepo.Save(booking);
            return booking.BookingId;
        }

        public int AddPassenger(Passenger passenger, int bookingId)
        {
            passenger.BookingId = bookingId;
            passenger.Pid = 0; // Forces insertion
            
            _prepo.Save(passenger);
            return passenger.Pid;
        }



        public Ticket GenerateTicket(Ticket ticket, int userId, int bookingId)
        {
            Booking? booking = _brepo.FindById(bookingId);
            User? user = _urepo.FindById(userId);
            ticket.Booking = booking; // Relation
            ticket.BookingId = booking?.BookingId; // ID explicit match
            ticket.User = user;
            ticket.UserId = user?.UserId;

            _trepo.Save(ticket);
            return ticket;
        }

        public void UpdateBooking(Booking bookPay)
        {
            _brepo.Save(bookPay);
        }

        public List<Ticket> GetTicket(int uid)
        {
            User? user = _urepo.FindById(uid);
            // Java just gets, assumes non-null or throws.
            // _trepo.findByUser(user);
            // Java Passed User object. Repo uses ID.
            if (user != null)
                return _trepo.FindByUser(user);
            return new List<Ticket>();
        }

        public Booking GetBookingById(int bid)
        {
            return _brepo.FindById(bid)!;
        }
    }
}
