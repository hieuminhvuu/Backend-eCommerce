CREATE TABLE `users` (
    `usr_id` INT NOT NULL AUTO_INCREMENT,
    `usr_age` INT DEFAULT '0',
    `usr_status` INT DEFAULT '0',
    `usr_name` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
    `usr_email` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
    `usr_address` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
    PRIMARY KEY (`usr_id`),
    KEY `idx_email_age_name` (`usr_email`, `usr_age`, `usr_name`),
    KEY `idx_status` (`usr_status`)
) ENGINE = InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_bin;