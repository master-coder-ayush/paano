CREATE TABLE `shortlist_creators` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`campaign_id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`notes` text,
	`rank` int NOT NULL DEFAULT 0,
	`status` varchar(40) NOT NULL,
	`added_by` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shortlist_creators_id` PRIMARY KEY(`id`),
	CONSTRAINT `shortlist_creators_campaign_creator_idx` UNIQUE(`campaign_id`,`creator_id`)
);
--> statement-breakpoint
ALTER TABLE `shortlist_creators` ADD CONSTRAINT `shortlist_creators_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shortlist_creators` ADD CONSTRAINT `shortlist_creators_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shortlist_creators` ADD CONSTRAINT `shortlist_creators_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shortlist_creators` ADD CONSTRAINT `shortlist_creators_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `shortlist_creators_campaign_idx` ON `shortlist_creators` (`workspace_id`,`campaign_id`,`status`);--> statement-breakpoint
CREATE INDEX `shortlist_creators_creator_idx` ON `shortlist_creators` (`creator_id`);