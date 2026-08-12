// Run with: npx tsx src/db/seed.ts  (adjust path to wherever you place this)
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { memeImageSchema } from './schema'; // <-- adjust this import path to your actual schema file

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const memeTemplates = [
  { image_url: 'https://i.imgflip.com/1bij.jpg' }, // One Does Not Simply
  { image_url: 'https://i.imgflip.com/1ur9b0.jpg' }, // Distracted Boyfriend
  { image_url: 'https://i.imgflip.com/26am.jpg' }, // Ancient Aliens
  { image_url: 'https://i.imgflip.com/30b1gx.jpg' }, // Drake Hotline Bling
  { image_url: 'https://i.imgflip.com/1g8my4.jpg' }, // Two Buttons
  { image_url: 'https://i.imgflip.com/24y43o.jpg' }, // Change My Mind
  { image_url: 'https://i.imgflip.com/1jwhww.jpg' }, // Expanding Brain
  { image_url: 'https://i.imgflip.com/345v97.jpg' }, // Woman Yelling at Cat
  { image_url: 'https://i.imgflip.com/1o00in.jpg' }, // Is This a Pigeon?
  { image_url: 'https://i.imgflip.com/2kbn1e.jpg' }, // Surprised Pikachu
];

async function seed() {
  console.log(`Seeding ${memeTemplates.length} meme templates...`);

  try {
    const inserted = await db
      .insert(memeImageSchema)
      .values(memeTemplates)
      .returning();

    console.log(`Successfully inserted ${inserted.length} templates:`);
    inserted.forEach((row) => console.log(`  - ${row.id}: ${row.image_url}`));
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
