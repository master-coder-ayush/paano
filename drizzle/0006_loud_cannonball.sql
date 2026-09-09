CREATE TABLE `collaboration_activity` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`collaboration_id` varchar(36) NOT NULL,
	`actor_user_id` varchar(36) NOT NULL,
	`action` varchar(80) NOT NULL,
	`note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaboration_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_drafts` (
	`id` varchar(36) NOT NULL,
	`collaboration_id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`author_user_id` varchar(36) NOT NULL,
	`body` text NOT NULL,
	`version` int NOT NULL,
	`status` varchar(40) NOT NULL,
	`review_notes` text,
	`submitted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_drafts_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_drafts_collaboration_version_idx` UNIQUE(`collaboration_id`,`version`)
);
--> statement-breakpoint
ALTER TABLE `collaboration_activity` ADD CONSTRAINT `collaboration_activity_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collaboration_activity` ADD CONSTRAINT `collaboration_activity_collaboration_id_collaborations_id_fk` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collaboration_activity` ADD CONSTRAINT `collaboration_activity_actor_user_id_users_id_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_drafts` ADD CONSTRAINT `content_drafts_collaboration_id_collaborations_id_fk` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_drafts` ADD CONSTRAINT `content_drafts_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `content_drafts` ADD CONSTRAINT `content_drafts_author_user_id_users_id_fk` FOREIGN KEY (`author_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `collaboration_activity_collaboration_idx` ON `collaboration_activity` (`collaboration_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `collaboration_activity_workspace_idx` ON `collaboration_activity` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `content_drafts_workspace_status_idx` ON `content_drafts` (`workspace_id`,`status`);