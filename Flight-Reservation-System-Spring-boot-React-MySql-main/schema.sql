USE fbs;

CREATE TABLE IF NOT EXISTS `user` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `Username` VARCHAR(255),
    `user_fullname` VARCHAR(255),
    `Email` VARCHAR(255),
    `Phone` VARCHAR(255),
    `Isadmin` INT,
    `Password` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `flight` (
    `FlightNumber` INT AUTO_INCREMENT PRIMARY KEY,
    `Source` VARCHAR(255),
    `Destination` VARCHAR(255),
    `travel_date` DATE,
    `arrival_time` TIME,
    `departure_time` TIME,
    `Price` DOUBLE,
    `AvailableSeats` INT
);

CREATE TABLE IF NOT EXISTS `booking` (
    `booking_id` INT AUTO_INCREMENT PRIMARY KEY,
    `seats` INT,
    `PayStatus` INT,
    `BookingDate` DATE,
    `flight_number` INT,
    CONSTRAINT `FK_booking_flight` FOREIGN KEY (`flight_number`) REFERENCES `flight` (`FlightNumber`)
);

CREATE TABLE IF NOT EXISTS `passenger` (
    `Pid` INT AUTO_INCREMENT PRIMARY KEY,
    `pass_name` VARCHAR(255),
    `Gender` VARCHAR(255),
    `Age` INT,
    `booking_id` INT,
    CONSTRAINT `FK_passenger_booking` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`)
);

CREATE TABLE IF NOT EXISTS `ticket` (
    `ticket_number` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `booking_id` INT,
    `Booking_date` DATE,
    `Total_pay` DOUBLE,
    CONSTRAINT `FK_ticket_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    CONSTRAINT `FK_ticket_booking` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`)
);
