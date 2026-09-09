CREATE TABLE `conversion_events` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`pixel_event_id` varchar(36) NOT NULL,
	`event_type` varchar(80) NOT NULL,
	`value_amount` decimal(12,2),
	`currency` varchar(3),
	`payload` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversion_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `conversion_events_pixel_event_idx` UNIQUE(`pixel_event_id`)
);
--> statement-breakpoint
CREATE TABLE `pixel_debug_events` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`site_key_id` varchar(36) NOT NULL,
	`event_type` varchar(80) NOT NULL,
	`payload` json,
	`result` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pixel_debug_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pixel_events` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`site_key_id` varchar(36) NOT NULL,
	`event_type` varchar(80) NOT NULL,
	`event_id` varchar(120) NOT NULL,
	`payload` json,
	`identity_hash` varchar(128),
	`received_at` timestamp NOT NULL DEFAULT (now()),
	`status` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pixel_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `pixel_events_site_event_idx` UNIQUE(`site_key_id`,`event_id`)
);
--> statement-breakpoint
CREATE TABLE `pixel_site_keys` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`key` varchar(80) NOT NULL,
	`status` varchar(20) NOT NULL,
	`revoked_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pixel_site_keys_id` PRIMARY KEY(`id`),
	CONSTRAINT `pixel_site_keys_key_idx` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `spaces` ADD `tracking_key_id` varchar(36);--> statement-breakpoint
ALTER TABLE `conversion_events` ADD CONSTRAINT `conversion_events_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversion_events` ADD CONSTRAINT `conversion_events_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversion_events` ADD CONSTRAINT `conversion_events_pixel_event_id_pixel_events_id_fk` FOREIGN KEY (`pixel_event_id`) REFERENCES `pixel_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_debug_events` ADD CONSTRAINT `pixel_debug_events_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_debug_events` ADD CONSTRAINT `pixel_debug_events_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_debug_events` ADD CONSTRAINT `pixel_debug_events_site_key_id_pixel_site_keys_id_fk` FOREIGN KEY (`site_key_id`) REFERENCES `pixel_site_keys`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_events` ADD CONSTRAINT `pixel_events_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_events` ADD CONSTRAINT `pixel_events_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_events` ADD CONSTRAINT `pixel_events_site_key_id_pixel_site_keys_id_fk` FOREIGN KEY (`site_key_id`) REFERENCES `pixel_site_keys`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_site_keys` ADD CONSTRAINT `pixel_site_keys_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pixel_site_keys` ADD CONSTRAINT `pixel_site_keys_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `conversion_events_workspace_idx` ON `conversion_events` (`workspace_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `pixel_debug_events_workspace_idx` ON `pixel_debug_events` (`workspace_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `pixel_events_space_idx` ON `pixel_events` (`space_id`,`received_at`);--> statement-breakpoint
CREATE INDEX `pixel_events_type_idx` ON `pixel_events` (`event_type`);--> statement-breakpoint
CREATE INDEX `pixel_site_keys_space_idx` ON `pixel_site_keys` (`space_id`);--> statement-breakpoint
CREATE INDEX `pixel_site_keys_workspace_idx` ON `pixel_site_keys` (`workspace_id`);