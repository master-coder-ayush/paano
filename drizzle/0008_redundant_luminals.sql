CREATE TABLE `referral_attributions` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`referral_link_id` varchar(36) NOT NULL,
	`referrer_user_id` varchar(36) NOT NULL,
	`referred_entity_type` varchar(40) NOT NULL,
	`referred_entity_id` varchar(36) NOT NULL,
	`reward_window_start` timestamp,
	`reward_window_end` timestamp,
	`status` varchar(40) NOT NULL,
	`amount` decimal(12,2) NOT NULL DEFAULT '0',
	`reward_rule_version` varchar(40) NOT NULL DEFAULT 'v1',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referral_attributions_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_attributions_entity_idx` UNIQUE(`referral_link_id`,`referred_entity_type`,`referred_entity_id`)
);
--> statement-breakpoint
CREATE TABLE `referral_links` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`referrer_user_id` varchar(36) NOT NULL,
	`type` varchar(20) NOT NULL,
	`token` varchar(120) NOT NULL,
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referral_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_links_token_idx` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `referral_rewards` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`attribution_id` varchar(36) NOT NULL,
	`referrer_user_id` varchar(36) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referral_rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `referral_attributions` ADD CONSTRAINT `referral_attributions_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referral_attributions` ADD CONSTRAINT `referral_attributions_referral_link_id_referral_links_id_fk` FOREIGN KEY (`referral_link_id`) REFERENCES `referral_links`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referral_attributions` ADD CONSTRAINT `referral_attributions_referrer_user_id_users_id_fk` FOREIGN KEY (`referrer_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referral_links` ADD CONSTRAINT `referral_links_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referral_links` ADD CONSTRAINT `referral_links_referrer_user_id_users_id_fk` FOREIGN KEY (`referrer_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referral_rewards` ADD CONSTRAINT `referral_rewards_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referral_rewards` ADD CONSTRAINT `referral_rewards_attribution_id_referral_attributions_id_fk` FOREIGN KEY (`attribution_id`) REFERENCES `referral_attributions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referral_rewards` ADD CONSTRAINT `referral_rewards_referrer_user_id_users_id_fk` FOREIGN KEY (`referrer_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `referral_attributions_owner_status_idx` ON `referral_attributions` (`workspace_id`,`referrer_user_id`,`status`);--> statement-breakpoint
CREATE INDEX `referral_links_owner_idx` ON `referral_links` (`workspace_id`,`referrer_user_id`);--> statement-breakpoint
CREATE INDEX `referral_rewards_owner_status_idx` ON `referral_rewards` (`workspace_id`,`referrer_user_id`,`status`);--> statement-breakpoint
CREATE INDEX `referral_rewards_attribution_idx` ON `referral_rewards` (`attribution_id`);