CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prompt` text NOT NULL,
	`imageUrl` text NOT NULL,
	`modelId` text NOT NULL,
	`provider` text NOT NULL,
	`type` text NOT NULL,
	`createdAt` integer DEFAULT '"2026-03-18T13:56:25.943Z"'
);
