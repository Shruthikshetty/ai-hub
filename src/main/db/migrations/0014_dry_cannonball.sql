PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_connectors` (
	`name` text PRIMARY KEY NOT NULL,
	`display_name` text DEFAULT '',
	`description` text DEFAULT '',
	`bot_token` text NOT NULL,
	`allowed_users` text DEFAULT '[]',
	`active_conversation_id` integer,
	`model-id` text NOT NULL,
	`provider` text NOT NULL,
	`system-prompt` text DEFAULT 'You are a helpful, concise AI assistant. Format your replies with clean markdown suitable for Telegram mobile screens.',
	`message_limit` integer,
	`tools` text DEFAULT '{"search":{"enabled":false},"profileAccess":{"enabled":false},"imageGeneration":{"enabled":false}}',
	`additional_options` text DEFAULT '{"speech":{"enabled":false}}',
	`auto_start` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`active_conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_connectors`("name", "display_name", "description", "bot_token", "allowed_users", "active_conversation_id", "model-id", "provider", "system-prompt", "message_limit", "tools", "additional_options", "auto_start", "created_at", "updated_at") SELECT "name", "display_name", "description", "bot_token", "allowed_users", "active_conversation_id", "model-id", "provider", "system-prompt", "message_limit", "tools", "additional_options", "auto_start", "created_at", "updated_at" FROM `connectors`;--> statement-breakpoint
DROP TABLE `connectors`;--> statement-breakpoint
ALTER TABLE `__new_connectors` RENAME TO `connectors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `providers` ADD `note` text;