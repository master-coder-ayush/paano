CREATE TABLE `email_delivery_attempts` (
	`id` varchar(36) NOT NULL,
	`recipient_user_id` varchar(36),
	`recipient_email` varchar(255) NOT NULL,
	`template` varchar(80) NOT NULL,
	`status` varchar(40) NOT NULL,
	`provider_message_id` varchar(120),
	`error_message` text,
	`metadata` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_delivery_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(36) NOT NULL,
	`recipient_user_id` varchar(36) NOT NULL,
	`workspace_id` varchar(36),
	`type` varchar(80) NOT NULL,
	`entity_type` varchar(80),
	`entity_id` varchar(36),
	`metadata` json NOT NULL,
	`status` varchar(40) NOT NULL,
	`read_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_onboarding_states` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`selected_role` varchar(40),
	`status` varchar(40) NOT NULL,
	`current_step` varchar(80) NOT NULL,
	`profile_draft` json NOT NULL,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_onboarding_states_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_onboarding_states_user_id_idx` UNIQUE(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `email_delivery_attempts` ADD CONSTRAINT `email_delivery_attempts_recipient_user_id_users_id_fk` FOREIGN KEY (`recipient_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_recipient_user_id_users_id_fk` FOREIGN KEY (`recipient_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_onboarding_states` ADD CONSTRAINT `user_onboarding_states_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `email_delivery_attempts_recipient_idx` ON `email_delivery_attempts` (`recipient_email`);--> statement-breakpoint
CREATE INDEX `email_delivery_attempts_status_idx` ON `email_delivery_attempts` (`status`);--> statement-breakpoint
CREATE INDEX `email_delivery_attempts_template_idx` ON `email_delivery_attempts` (`template`);--> statement-breakpoint
CREATE INDEX `notifications_recipient_status_idx` ON `notifications` (`recipient_user_id`,`status`);--> statement-breakpoint
CREATE INDEX `notifications_workspace_id_idx` ON `notifications` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `notifications_entity_idx` ON `notifications` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `user_onboarding_states_status_idx` ON `user_onboarding_states` (`status`);--> statement-breakpoint
CREATE INDEX `user_onboarding_states_selected_role_idx` ON `user_onboarding_states` (`selected_role`);