CREATE TABLE `attribution_records` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`conversion_event_id` varchar(36) NOT NULL,
	`tracking_click_id` varchar(36),
	`campaign_id` varchar(36),
	`creator_id` varchar(36),
	`published_post_id` varchar(36),
	`attribution_model` varchar(40) NOT NULL,
	`confidence` varchar(20) NOT NULL,
	`explanation` text NOT NULL,
	`status` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attribution_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `attribution_records_conversion_idx` UNIQUE(`conversion_event_id`)
);
--> statement-breakpoint
ALTER TABLE `attribution_records` ADD CONSTRAINT `attribution_records_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attribution_records` ADD CONSTRAINT `attribution_records_conversion_event_id_conversion_events_id_fk` FOREIGN KEY (`conversion_event_id`) REFERENCES `conversion_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attribution_records` ADD CONSTRAINT `attribution_records_tracking_click_id_tracking_clicks_id_fk` FOREIGN KEY (`tracking_click_id`) REFERENCES `tracking_clicks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attribution_records` ADD CONSTRAINT `attribution_records_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attribution_records` ADD CONSTRAINT `attribution_records_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attribution_records` ADD CONSTRAINT `attribution_records_published_post_id_published_posts_id_fk` FOREIGN KEY (`published_post_id`) REFERENCES `published_posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `attribution_records_workspace_idx` ON `attribution_records` (`workspace_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `attribution_records_campaign_idx` ON `attribution_records` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `attribution_records_creator_idx` ON `attribution_records` (`creator_id`);