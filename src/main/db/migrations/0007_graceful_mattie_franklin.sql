ALTER TABLE `conversations` ADD `reasoning` text DEFAULT 'none';--> statement-breakpoint
ALTER TABLE `conversations` ADD `systemPrompt` text;--> statement-breakpoint
ALTER TABLE `conversations` ADD `metadata` text DEFAULT '{}';--> statement-breakpoint
ALTER TABLE `conversations` ADD `tools` text DEFAULT '{"search":false,"imageGeneration":false}';