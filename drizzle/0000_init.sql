CREATE TABLE `catch_ups` (
	`id` text PRIMARY KEY NOT NULL,
	`friend_id` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`friend_id`) REFERENCES `friends`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `catch_ups_friend_id_idx` ON `catch_ups` (`friend_id`);--> statement-breakpoint
CREATE TABLE `friends` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_id` text,
	`interval_count` integer NOT NULL,
	`interval_unit` text NOT NULL,
	`note` text,
	`created_at` text NOT NULL
);
