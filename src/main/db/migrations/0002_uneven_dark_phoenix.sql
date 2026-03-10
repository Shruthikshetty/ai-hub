CREATE TABLE `providers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text,
	`name` text,
	`apiKey` text,
	`description` text,
	`icon` text,
	`enabled` integer DEFAULT false,
	`server` integer DEFAULT false,
	`serverUrl` text,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `providers_provider_unique` ON `providers` (`provider`);