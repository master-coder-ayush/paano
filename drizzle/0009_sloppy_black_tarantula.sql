CREATE TABLE `tracking_clicks` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`tracking_link_id` varchar(36) NOT NULL,
	`clicked_at` timestamp NOT NULL DEFAULT (now()),
	`referrer` varchar(500),
	`utm_params` json,
	`user_agent` varchar(500),
	`device_type` varchar(30),
	`browser` varchar(80),
	`ip_region` varchar(80),
	`bot_score` int NOT NULL DEFAULT 0,
	`is_bot` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracking_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tracking_links` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`campaign_id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`collaboration_id` varchar(36) NOT NULL,
	`published_post_id` varchar(36),
	`destination_url` varchar(500) NOT NULL,
	`token` varchar(120) NOT NULL,
	`status` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracking_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `tracking_links_token_idx` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `tracking_clicks` ADD CONSTRAINT `tracking_clicks_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking_clicks` ADD CONSTRAINT `tracking_clicks_tracking_link_id_tracking_links_id_fk` FOREIGN KEY (`tracking_link_id`) REFERENCES `tracking_links`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking_links` ADD CONSTRAINT `tracking_links_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking_links` ADD CONSTRAINT `tracking_links_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking_links` ADD CONSTRAINT `tracking_links_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking_links` ADD CONSTRAINT `tracking_links_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking_links` ADD CONSTRAINT `tracking_links_collaboration_id_collaborations_id_fk` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracking_links` ADD CONSTRAINT `tracking_links_published_post_id_published_posts_id_fk` FOREIGN KEY (`published_post_id`) REFERENCES `published_posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `tracking_clicks_link_idx` ON `tracking_clicks` (`tracking_link_id`,`clicked_at`);--> statement-breakpoint
CREATE INDEX `tracking_clicks_workspace_idx` ON `tracking_clicks` (`workspace_id`,`clicked_at`);--> statement-breakpoint
CREATE INDEX `tracking_links_workspace_idx` ON `tracking_links` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `tracking_links_collaboration_idx` ON `tracking_links` (`collaboration_id`);