CREATE TABLE `billing_profiles` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`legal_name` varchar(180) NOT NULL,
	`tax_country` varchar(2),
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `billing_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `billing_profiles_workspace_id_idx` UNIQUE(`workspace_id`)
);
--> statement-breakpoint
CREATE TABLE `creator_earnings` (
	`id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`collaboration_id` varchar(36),
	`source_type` varchar(40) NOT NULL,
	`source_id` varchar(36),
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creator_earnings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoice_records` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`invoice_number` varchar(80) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`issued_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoice_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoice_records_number_idx` UNIQUE(`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `payment_records` (
	`id` varchar(36) NOT NULL,
	`workspace_id` varchar(36) NOT NULL,
	`wallet_account_id` varchar(36),
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`reference` varchar(120),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payout_records` (
	`id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`withdrawal_request_id` varchar(36),
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payout_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `withdrawal_requests` (
	`id` varchar(36) NOT NULL,
	`creator_id` varchar(36) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`status` varchar(40) NOT NULL,
	`requested_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `withdrawal_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `billing_profiles` ADD CONSTRAINT `billing_profiles_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creator_earnings` ADD CONSTRAINT `creator_earnings_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creator_earnings` ADD CONSTRAINT `creator_earnings_collaboration_id_collaborations_id_fk` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invoice_records` ADD CONSTRAINT `invoice_records_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_records` ADD CONSTRAINT `payment_records_workspace_id_workspaces_id_fk` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_records` ADD CONSTRAINT `payment_records_wallet_account_id_wallet_accounts_id_fk` FOREIGN KEY (`wallet_account_id`) REFERENCES `wallet_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payout_records` ADD CONSTRAINT `payout_records_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payout_records` ADD CONSTRAINT `payout_records_withdrawal_request_id_withdrawal_requests_id_fk` FOREIGN KEY (`withdrawal_request_id`) REFERENCES `withdrawal_requests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `withdrawal_requests` ADD CONSTRAINT `withdrawal_requests_creator_id_creators_id_fk` FOREIGN KEY (`creator_id`) REFERENCES `creators`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `creator_earnings_creator_status_idx` ON `creator_earnings` (`creator_id`,`status`);--> statement-breakpoint
CREATE INDEX `creator_earnings_collaboration_id_idx` ON `creator_earnings` (`collaboration_id`);--> statement-breakpoint
CREATE INDEX `invoice_records_workspace_status_idx` ON `invoice_records` (`workspace_id`,`status`);--> statement-breakpoint
CREATE INDEX `payment_records_workspace_status_idx` ON `payment_records` (`workspace_id`,`status`);--> statement-breakpoint
CREATE INDEX `payout_records_creator_status_idx` ON `payout_records` (`creator_id`,`status`);--> statement-breakpoint
CREATE INDEX `withdrawal_requests_creator_status_idx` ON `withdrawal_requests` (`creator_id`,`status`);