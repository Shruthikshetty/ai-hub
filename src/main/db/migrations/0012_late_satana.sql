PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mcp_servers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'http' NOT NULL,
	`url` text,
	`command` text,
	`args` text DEFAULT '[]',
	`cwd` text,
	`auth_token` text,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_mcp_servers`("id", "name", "type", "url", "command", "auth_token", "enabled", "created_at", "updated_at") SELECT "id", "name", "type", "url", "command", "auth_token", "enabled", "created_at", "updated_at" FROM `mcp_servers`;--> statement-breakpoint
DROP TABLE `mcp_servers`;--> statement-breakpoint
ALTER TABLE `__new_mcp_servers` RENAME TO `mcp_servers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `mcp_servers_name_unique` ON `mcp_servers` (`name`);