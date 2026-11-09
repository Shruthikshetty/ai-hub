CREATE TABLE `mcp_servers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'http' NOT NULL,
	`url` text NOT NULL,
	`command` text,
	`auth_token` text,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
