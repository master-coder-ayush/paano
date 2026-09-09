CREATE TABLE `export_jobs` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`requested_by` varchar(36) NOT NULL,
	`filters` json NOT NULL,
	`status` varchar(20) NOT NULL,
	`file_url` varchar(500),
	`storage_ref` varchar(255),
	`error` text,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `export_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `export_jobs` ADD CONSTRAINT `export_jobs_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `export_jobs` ADD CONSTRAINT `export_jobs_requested_by_users_id_fk` FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `export_jobs_workspace_idx` ON `export_jobs` (`workspace_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `export_jobs_status_idx` ON `export_jobs` (`status`);