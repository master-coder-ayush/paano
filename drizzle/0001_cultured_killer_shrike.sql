CREATE TABLE `admin_review_items` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36),
	`subject_type` varchar(80) NOT NULL,
	`subject_id` varchar(36) NOT NULL,
	`status` varchar(40) NOT NULL,
	`assignee_id` varchar(36),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_review_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36),
	`actor_user_id` varchar(36),
	`action` varchar(120) NOT NULL,
	`entity_type` varchar(80) NOT NULL,
	`entity_id` varchar(36) NOT NULL,
	`metadata` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_accounts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`provider` varchar(40) NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auth_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_accounts_provider_account_idx` UNIQUE(`provider`,`provider_account_id`)
);
--> statement-breakpoint
CREATE TABLE `auth_tokens` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`workspace_id` varchar(36),
	`token_hash` varchar(128) NOT NULL,
	`type` varchar(40) NOT NULL,
	`scopes` json NOT NULL,
	`expires_at` timestamp,
	`last_used_at` timestamp,
	`revoked_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auth_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_tokens_token_hash_idx` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`company_name` varchar(180) NOT NULL,
	`website` varchar(255),
	`industry` varchar(120),
	`target_icp` text,
	`default_space_id` varchar(36),
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brands_workspace_id_idx` UNIQUE(`workspace_id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`brand_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`name` varchar(180) NOT NULL,
	`goal` text,
	`budget_amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`target_icp` text,
	`target_regions` json NOT NULL,
	`cta_url` varchar(255),
	`status` varchar(40) NOT NULL,
	`notes` text,
	`starts_at` timestamp,
	`ends_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaborations` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`brand_id` varchar(36) NOT NULL,
	`campaign_id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`deliverable_notes` text,
	`published_post_url` varchar(255),
	`price_amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`due_at` timestamp,
	`accepted_at` timestamp,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaborations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creator_profiles` (
	`id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`public_slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`linkedin_url` varchar(255) NOT NULL,
	`headline` varchar(255),
	`bio` text,
	`country` varchar(80),
	`topics` json NOT NULL,
	`follower_count` int NOT NULL,
	`price_per_post_amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`public_card_status` varchar(40) NOT NULL,
	`published_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creator_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `creator_profiles_public_slug_idx` UNIQUE(`public_slug`),
	CONSTRAINT `creator_profiles_creator_id_idx` UNIQUE(`creator_id`)
);
--> statement-breakpoint
CREATE TABLE `creators` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`status` varchar(40) NOT NULL,
	`verification_status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creators_id` PRIMARY KEY(`id`),
	CONSTRAINT `creators_workspace_id_idx` UNIQUE(`workspace_id`)
);
--> statement-breakpoint
CREATE TABLE `message_threads` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`entity_type` varchar(80) NOT NULL,
	`entity_id` varchar(36) NOT NULL,
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `message_threads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(36) NOT NULL,
	`thread_id` varchar(36) NOT NULL,
	`sender_user_id` varchar(36) NOT NULL,
	`body` text NOT NULL,
	`attachments` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spaces` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`brand_id` varchar(36) NOT NULL,
	`name` varchar(160) NOT NULL,
	`website` varchar(255),
	`description` text,
	`industry` varchar(120),
	`target_icp` text,
	`target_locations` json NOT NULL,
	`default_cta_url` varchar(255),
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `spaces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified_at` timestamp,
	`password_hash` varchar(255) NOT NULL,
	`status` varchar(40) NOT NULL,
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `wallet_accounts` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallet_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallet_accounts_workspace_currency_idx` UNIQUE(`workspace_id`,`currency`)
);
--> statement-breakpoint
CREATE TABLE `wallet_ledger_entries` (
	`id` varchar(36) NOT NULL,
	`wallet_account_id` varchar(36) NOT NULL,
	`type` varchar(40) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`source_type` varchar(80),
	`source_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wallet_ledger_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspace_invites` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`role` varchar(40) NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`status` varchar(40) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`accepted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspace_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `workspace_invites_token_hash_idx` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `workspace_members` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` varchar(40) NOT NULL,
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspace_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `workspace_members_workspace_user_idx` UNIQUE(`workspace_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` varchar(36) NOT NULL,
	`type` varchar(40) NOT NULL,
	`name` varchar(180) NOT NULL,
	`status` varchar(40) NOT NULL,
	`owner_user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admin_review_items` ADD CONSTRAINT `admin_review_items_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_review_items` ADD CONSTRAINT `admin_review_items_assignee_id_users_id_fk` FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_actor_user_id_users_id_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_accounts` ADD CONSTRAINT `auth_accounts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_tokens` ADD CONSTRAINT `auth_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_tokens` ADD CONSTRAINT `auth_tokens_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `brands` ADD CONSTRAINT `brands_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_brand_id_brands_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_space_id_spaces_id_fk` FOREIGN KEY (`space_id`) REFERENCES `spaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collaborations` ADD CONSTRAINT `collaborations_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collaborations` ADD CONSTRAINT `collaborations_brand_id_brands_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collaborations` ADD CONSTRAINT `collaborations_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collaborations` ADD CONSTRAINT `collaborations_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creator_profiles` ADD CONSTRAINT `creator_profiles_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creators` ADD CONSTRAINT `creators_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creators` ADD CONSTRAINT `creators_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message_threads` ADD CONSTRAINT `message_threads_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_thread_id_message_threads_id_fk` FOREIGN KEY (`thread_id`) REFERENCES `message_threads`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_user_id_users_id_fk` FOREIGN KEY (`sender_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `spaces` ADD CONSTRAINT `spaces_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `spaces` ADD CONSTRAINT `spaces_brand_id_brands_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_accounts` ADD CONSTRAINT `wallet_accounts_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_ledger_entries` ADD CONSTRAINT `wallet_ledger_entries_wallet_account_id_wallet_accounts_id_fk` FOREIGN KEY (`wallet_account_id`) REFERENCES `wallet_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspace_invites` ADD CONSTRAINT `workspace_invites_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspace_members` ADD CONSTRAINT `workspace_members_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspace_members` ADD CONSTRAINT `workspace_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_owner_user_id_users_id_fk` FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `admin_review_items_status_idx` ON `admin_review_items` (`status`);--> statement-breakpoint
CREATE INDEX `admin_review_items_assignee_id_idx` ON `admin_review_items` (`assignee_id`);--> statement-breakpoint
CREATE INDEX `admin_review_items_subject_idx` ON `admin_review_items` (`subject_type`,`subject_id`);--> statement-breakpoint
CREATE INDEX `admin_review_items_workspace_id_idx` ON `admin_review_items` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_workspace_id_idx` ON `audit_logs` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_actor_user_id_idx` ON `audit_logs` (`actor_user_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `auth_accounts_user_id_idx` ON `auth_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `auth_tokens_user_id_idx` ON `auth_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `auth_tokens_workspace_id_idx` ON `auth_tokens` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `brands_status_idx` ON `brands` (`status`);--> statement-breakpoint
CREATE INDEX `campaigns_workspace_status_idx` ON `campaigns` (`workspace_id`,`status`);--> statement-breakpoint
CREATE INDEX `campaigns_space_id_idx` ON `campaigns` (`space_id`);--> statement-breakpoint
CREATE INDEX `collaborations_workspace_status_idx` ON `collaborations` (`workspace_id`,`status`);--> statement-breakpoint
CREATE INDEX `collaborations_campaign_id_idx` ON `collaborations` (`campaign_id`);--> statement-breakpoint
CREATE INDEX `collaborations_creator_id_idx` ON `collaborations` (`creator_id`);--> statement-breakpoint
CREATE INDEX `creator_profiles_country_idx` ON `creator_profiles` (`country`);--> statement-breakpoint
CREATE INDEX `creators_user_id_idx` ON `creators` (`user_id`);--> statement-breakpoint
CREATE INDEX `creators_status_idx` ON `creators` (`status`,`verification_status`);--> statement-breakpoint
CREATE INDEX `message_threads_workspace_entity_idx` ON `message_threads` (`workspace_id`,`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `messages_thread_id_idx` ON `messages` (`thread_id`);--> statement-breakpoint
CREATE INDEX `messages_sender_user_id_idx` ON `messages` (`sender_user_id`);--> statement-breakpoint
CREATE INDEX `spaces_workspace_id_idx` ON `spaces` (`workspace_id`);--> statement-breakpoint
CREATE INDEX `spaces_brand_id_idx` ON `spaces` (`brand_id`);--> statement-breakpoint
CREATE INDEX `spaces_status_idx` ON `spaces` (`status`);--> statement-breakpoint
CREATE INDEX `users_status_idx` ON `users` (`status`);--> statement-breakpoint
CREATE INDEX `wallet_ledger_entries_wallet_id_idx` ON `wallet_ledger_entries` (`wallet_account_id`);--> statement-breakpoint
CREATE INDEX `wallet_ledger_entries_status_idx` ON `wallet_ledger_entries` (`status`);--> statement-breakpoint
CREATE INDEX `workspace_invites_workspace_email_idx` ON `workspace_invites` (`workspace_id`,`email`);--> statement-breakpoint
CREATE INDEX `workspace_members_user_id_idx` ON `workspace_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `workspace_members_role_status_idx` ON `workspace_members` (`role`,`status`);--> statement-breakpoint
CREATE INDEX `workspaces_owner_user_id_idx` ON `workspaces` (`owner_user_id`);--> statement-breakpoint
CREATE INDEX `workspaces_type_status_idx` ON `workspaces` (`type`,`status`);