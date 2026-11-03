CREATE INDEX `conversations_updated_at_idx` ON `conversations` (`updated_at`);--> statement-breakpoint
CREATE INDEX `messages_conv_created_idx` ON `message` (`conversationId`,`created_at`);--> statement-breakpoint
CREATE INDEX `media_type_id_idx` ON `media` (`type`,`id`);--> statement-breakpoint
CREATE INDEX `media_message_id_idx` ON `media` (`messageId`);