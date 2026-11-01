CREATE TABLE `connectors` (
	`name` text PRIMARY KEY NOT NULL,
	`bot_token` text NOT NULL,
	`allowed_users` text DEFAULT '[]',
	`default_provider` text,
	`model-id` text NOT NULL,
	`provider` text NOT NULL,
	`system-prompt` text DEFAULT 'You are a helpful, concise AI assistant. Format your replies with clean markdown suitable for Telegram mobile screens.',
	`auto_start` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
