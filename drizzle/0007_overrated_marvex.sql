CREATE TABLE `published_posts` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`collaboration_id` varchar(36) NOT NULL,
	`campaign_id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`platform` varchar(40) NOT NULL,
	`url` varchar(500) NOT NULL,
	`published_at` timestamp NOT NULL,
	`submitted_by` varchar(36) NOT NULL,
	`verification_status` varchar(40) NOT NULL,
	`manual_metrics` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `published_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `published_posts_collaboration_idx` UNIQUE(`collaboration_id`)
);
--> statement-breakpoint
CREATE TABLE `result_snapshots` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`published_post_id` varchar(36) NOT NULL,
	`campaign_id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`leads` int NOT NULL DEFAULT 0,
	`signups` int NOT NULL DEFAULT 0,
	`revenue_amount` decimal(12,2) NOT NULL DEFAULT '0',
	`currency` varchar(3) NOT NULL,
	`source` varchar(40) NOT NULL,
	`recorded_by` varchar(36) NOT NULL,
	`recorded_at` timestamp NOT NULL DEFAULT (now()),
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `result_snapshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `result_snapshots_post_idx` UNIQUE(`published_post_id`)
);
--> statement-breakpoint
ALTER TABLE `published_posts` ADD CONSTRAINT `published_posts_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `published_posts` ADD CONSTRAINT `published_posts_collaboration_id_collaborations_id_fk` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `published_posts` ADD CONSTRAINT `published_posts_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `published_posts` ADD CONSTRAINT `published_posts_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `published_posts` ADD CONSTRAINT `published_posts_submitted_by_users_id_fk` FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result_snapshots` ADD CONSTRAINT `result_snapshots_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result_snapshots` ADD CONSTRAINT `result_snapshots_published_post_id_published_posts_id_fk` FOREIGN KEY (`published_post_id`) REFERENCES `published_posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result_snapshots` ADD CONSTRAINT `result_snapshots_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result_snapshots` ADD CONSTRAINT `result_snapshots_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `result_snapshots` ADD CONSTRAINT `result_snapshots_recorded_by_users_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `published_posts_workspace_idx` ON `published_posts` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `published_posts_campaign_idx` ON `published_posts` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `published_posts_creator_idx` ON `published_posts` (`creator_id`);--> statement-breakpoint
CREATE INDEX `result_snapshots_workspace_idx` ON `result_snapshots` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `result_snapshots_campaign_idx` ON `result_snapshots` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `result_snapshots_creator_idx` ON `result_snapshots` (`creator_id`);--> statement-breakpoint
CREATE INDEX `result_snapshots_recorded_idx` ON `result_snapshots` (`recorded_at`);