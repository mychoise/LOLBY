import { boolean, timestamp } from 'drizzle-orm/pg-core';
import { uuid, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const memeImageSchema = pgTable('meme_image', {
  id: uuid('id').primaryKey().defaultRandom(),
  image_url: varchar('image_url', { length: 255 }).notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
