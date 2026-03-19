PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_providers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
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
INSERT INTO `__new_providers`("id", "provider", "name", "apiKey", "description", "icon", "enabled", "server", "serverUrl", "created_at", "updated_at") SELECT "id", "provider", "name", "apiKey", "description", "icon", "enabled", "server", "serverUrl", "created_at", "updated_at" FROM `providers`;--> statement-breakpoint
DROP TABLE `providers`;--> statement-breakpoint
ALTER TABLE `__new_providers` RENAME TO `providers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `providers_provider_unique` ON `providers` (`provider`);