using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMyFlight.Backend.Entities
{
    // Maps this class to the "ticket" table in the database
    [Table("ticket")]
    public class Ticket
    {
        // Primary key column "ticket_number"
        // Auto-generated identity value
        [Key]
        [Column("ticket_number")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TicketNumber { get; set; }

        // Foreign key column "user_id"
        // Nullable because a ticket might not be linked to a user
        [Column("user_id")]
        public int? UserId { get; set; }

        // Navigation property to User entity
        [ForeignKey("UserId")]
        public User? User { get; set; }

        // Foreign key column "booking_id"
        // Nullable because a ticket might not be linked to a booking
        [Column("booking_id")]
        public int? BookingId { get; set; }

        // Navigation property to Booking entity
        [ForeignKey("BookingId")]
        public Booking? Booking { get; set; }

        // Column "booking_date"
        // Stores the date when the booking was made
        [Column("booking_date")]
        public DateOnly? Booking_date { get; set; }

        // Column "total_pay"
        // Stores the total payment amount for the ticket
        // Defaults to 0 if not set
        [Column("total_pay")]
        public double Total_pay { get; set; } = 0;
    }
}
