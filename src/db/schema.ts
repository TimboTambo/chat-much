import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const friends = sqliteTable('friends', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  /** expo-contacts id; null for friends added by name. */
  contactId: text('contact_id'),
  intervalCount: integer('interval_count').notNull(),
  intervalUnit: text('interval_unit', { enum: ['day', 'week', 'month'] }).notNull(),
  note: text('note'),
  /** ISO datetime. */
  createdAt: text('created_at').notNull(),
});

export const catchUps = sqliteTable(
  'catch_ups',
  {
    id: text('id').primaryKey(),
    friendId: text('friend_id')
      .notNull()
      .references(() => friends.id, { onDelete: 'cascade' }),
    /** Local calendar date, YYYY-MM-DD. */
    date: text('date').notNull(),
    /** ISO datetime. */
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('catch_ups_friend_id_idx').on(t.friendId)],
);

export type FriendRow = typeof friends.$inferSelect;
export type CatchUpRow = typeof catchUps.$inferSelect;
