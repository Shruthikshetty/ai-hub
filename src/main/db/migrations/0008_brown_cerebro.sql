PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text DEFAULT 'New Chat',
	`modelId` text NOT NULL,
	`provider` text NOT NULL,
	`reasoning` text DEFAULT 'none',
	`systemPrompt` text,
	`metadata` integer DEFAULT true,
	`tools` text DEFAULT '{"search":false,"imageGeneration":false}',
	`created_at` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_conversations`("id", "title", "modelId", "provider", "reasoning", "systemPrompt", "metadata", "tools", "created_at", "updated_at") SELECT "id", "title", "modelId", "provider", "reasoning", "systemPrompt", "metadata", "tools", "created_at", "updated_at" FROM `conversations`;--> statement-breakpoint
DROP TABLE `conversations`;--> statement-breakpoint
ALTER TABLE `__new_conversations` RENAME TO `conversations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;