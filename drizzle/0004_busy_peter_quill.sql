CREATE TABLE `campaign_briefs` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`campaign_id` varchar(36) NOT NULL,
	`version` int NOT NULL,
	`objectives` text NOT NULL,
	`key_messages` text NOT NULL,
	`guidelines` text NOT NULL,
	`deliverables` text NOT NULL,
	`usage_rights` text NOT NULL,
	`approval_rules` text NOT NULL,
	`cta_url` varchar(255) NOT NULL,
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaign_briefs_id` PRIMARY KEY(`id`),
	CONSTRAINT `campaign_briefs_campaign_version_idx` UNIQUE(`campaign_id`,`version`)
);
--> statement-breakpoint
ALTER TABLE `campaign_briefs` ADD CONSTRAINT `campaign_briefs_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `campaign_briefs` ADD CONSTRAINT `campaign_briefs_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `campaign_briefs_workspace_campaign_idx` ON `campaign_briefs` (`workspace_id`,`campaign_id`);