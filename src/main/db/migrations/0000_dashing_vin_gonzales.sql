CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text,
	`age` integer,
	`city` text,
	`created_at` integer,
	`updated_at` integer NOT NULL
);
