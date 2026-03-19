CREATE TABLE `conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text DEFAULT 'New Chat',
	`modelId` text NOT NULL,
	`provider` text NOT NULL,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`parts` text NOT NULL,
	`conversationId` integer NOT NULL,
	`created_at` integer
);
