ALTER TABLE `pixel_events` ADD `processed_at` timestamp;--> statement-breakpoint
ALTER TABLE `pixel_events` ADD `source` varchar(30) DEFAULT 'pixel' NOT NULL;--> statement-breakpoint
ALTER TABLE `pixel_events` ADD `consent_mode` varchar(30) DEFAULT 'granted' NOT NULL;--> statement-breakpoint
ALTER TABLE `pixel_events` ADD `pii_suppressed` int DEFAULT 0 NOT NULL;