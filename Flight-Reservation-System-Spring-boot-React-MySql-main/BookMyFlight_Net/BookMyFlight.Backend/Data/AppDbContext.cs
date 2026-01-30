using Microsoft.EntityFrameworkCore;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Passenger> Passengers { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Flight>(entity =>
            {
                entity.ToTable("flight");
                entity.Property(e => e.FlightNumber).HasColumnName("flight_number");
                entity.Property(e => e.Source).HasColumnName("source");
                entity.Property(e => e.Destination).HasColumnName("destination");
                entity.Property(e => e.TravelDate).HasColumnName("travel_date");
                entity.Property(e => e.ArrivalTime).HasColumnName("arrival_time");
                entity.Property(e => e.DepartureTime).HasColumnName("departure_time");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.AvailableSeats).HasColumnName("available_seats");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Fname).HasColumnName("user_fullname");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Isadmin).HasColumnName("isadmin");
                entity.Property(e => e.Password).HasColumnName("password");
            });

            modelBuilder.Entity<Booking>(entity =>
            {
                entity.ToTable("booking");
                entity.Property(e => e.BookingId).HasColumnName("booking_id");
                entity.Property(e => e.NumberOfSeatsToBook).HasColumnName("seats");
                entity.Property(e => e.PayStatus).HasColumnName("pay_status");
                entity.Property(e => e.BookingDate).HasColumnName("booking_date");
                entity.Property(e => e.FlightNumber).HasColumnName("flight_number");
            });

            modelBuilder.Entity<Passenger>(entity =>
            {
                entity.ToTable("passenger");
                entity.Property(e => e.Pid).HasColumnName("pid");
                entity.Property(e => e.Pname).HasColumnName("pass_name");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.Age).HasColumnName("age");
                entity.Property(e => e.BookingId).HasColumnName("booking_id");
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.ToTable("ticket");
                entity.Property(e => e.TicketNumber).HasColumnName("ticket_number");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.BookingId).HasColumnName("booking_id");
                entity.Property(e => e.Booking_date).HasColumnName("booking_date");
                entity.Property(e => e.Total_pay).HasColumnName("total_pay");
            });
        }
    }
}
