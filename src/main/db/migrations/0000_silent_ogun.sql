CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text,
	`age` integer,
	`city` text,
	`image` text,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`name` text,
	`apiKey` text,
	`description` text,
	`icon` text,
	`enabled` integer DEFAULT false,
	`server` integer DEFAULT false,
	`serverUrl` text,
	`siteUrl` text,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `providers_provider_unique` ON `providers` (`provider`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text DEFAULT 'New Chat',
	`modelId` text NOT NULL,
	`provider` text NOT NULL,
	`reasoning` text DEFAULT 'none',
	`systemPrompt` text,
	`metadata` integer DEFAULT true NOT NULL,
	`tools` text DEFAULT '{"search":false,"imageGeneration":false}',
	`created_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`metadata` text DEFAULT '{}',
	`parts` text NOT NULL,
	`conversationId` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prompt` text NOT NULL,
	`imageUrl` text NOT NULL,
	`relativePath` text NOT NULL,
	`modelId` text NOT NULL,
	`provider` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer
);
