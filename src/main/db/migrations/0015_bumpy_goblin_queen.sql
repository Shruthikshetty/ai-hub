CREATE TABLE `models` (
	`provider_id` text NOT NULL,
	`id` text NOT NULL,
	`canonical_id` text NOT NULL,
	`name` text NOT NULL,
	`origin_provider` text NOT NULL,
	`inputs` text DEFAULT '["text"]',
	`outputs` text DEFAULT '["text"]',
	`capabilities` text NOT NULL,
	`image_options` text,
	`tts_options` text,
	`video_options` text,
	`context_length` integer,
	`max_output_tokens` integer,
	`description` text,
	`tags` text DEFAULT '[]',
	`source` text DEFAULT 'github',
	`is_deprecated` integer DEFAULT false,
	`is_favorite` integer DEFAULT false,
	`is_hidden` integer DEFAULT false,
	`sort_order` integer DEFAULT 0,
	`synced_at` integer,
	`created_at` integer,
	PRIMARY KEY(`provider_id`, `id`)
);
--> statement-breakpoint
CREATE INDEX `models_provider_idx` ON `models` (`provider_id`);