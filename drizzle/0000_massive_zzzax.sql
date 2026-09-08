CREATE TABLE `service_checks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service` varchar(80) NOT NULL,
	`status` varchar(40) NOT NULL,
	`checked_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_checks_id` PRIMARY KEY(`id`)
);
