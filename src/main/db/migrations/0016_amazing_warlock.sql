PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_models` (
	`provider_id` text NOT NULL,
	`id` text NOT NULL,
	`canonical_id` text NOT NULL,
	`name` text NOT NULL,
	`origin_provider` text NOT NULL,
	`inputs` text DEFAULT '["text"]' NOT NULL,
	`outputs` text DEFAULT '["text"]' NOT NULL,
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
INSERT INTO `__new_models`("provider_id", "id", "canonical_id", "name", "origin_provider", "inputs", "outputs", "capabilities", "image_options", "tts_options", "video_options", "context_length", "max_output_tokens", "description", "tags", "source", "is_deprecated", "is_favorite", "is_hidden", "sort_order", "synced_at", "created_at") SELECT "provider_id", "id", "canonical_id", "name", "origin_provider", "inputs", "outputs", "capabilities", "image_options", "tts_options", "video_options", "context_length", "max_output_tokens", "description", "tags", "source", "is_deprecated", "is_favorite", "is_hidden", "sort_order", "synced_at", "created_at" FROM `models`;--> statement-breakpoint
DROP TABLE `models`;--> statement-breakpoint
ALTER TABLE `__new_models` RENAME TO `models`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `models_active_idx` ON `models` (`is_deprecated`,`is_hidden`,`provider_id`);