USE fbs;

-- Disable foreign key checks to allow modifying primary keys
SET FOREIGN_KEY_CHECKS = 0;

-- Add AUTO_INCREMENT to primary keys
ALTER TABLE `user` MODIFY `user_id` INT AUTO_INCREMENT;
ALTER TABLE `flight` MODIFY `flight_number` INT AUTO_INCREMENT;
ALTER TABLE `booking` MODIFY `booking_id` INT AUTO_INCREMENT;
ALTER TABLE `passenger` MODIFY `pid` INT AUTO_INCREMENT;
ALTER TABLE `ticket` MODIFY `ticket_number` INT AUTO_INCREMENT;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
