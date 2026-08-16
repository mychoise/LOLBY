// seed.ts
// Run with: npx tsx src/drizzle/seed.ts
// Requires DATABASE_URL in your .env

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { memeImageSchema } from './schema'; // adjust to your actual schema path

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

interface ImgflipMeme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

interface ImgflipResponse {
  success: boolean;
  data: {
    memes: ImgflipMeme[];
  };
}

async function fetchTemplates(): Promise<ImgflipMeme[]> {
  const res = await fetch('https://api.imgflip.com/get_memes');
  const json: ImgflipResponse = await res.json();

  if (!json.success) {
    throw new Error('Imgflip API returned success: false');
  }

  return json.data.memes; // up to 100 templates
}

async function seed() {
  console.log('Fetching templates from Imgflip...');
  const memes = await fetchTemplates();
  console.log(`Fetched ${memes.length} templates.`);

  const values = memes.map((m) => ({
    image_url: m.url,
  }));

  console.log(`Inserting ${values.length} templates into DB...`);

  try {
    const inserted = await db
      .insert(memeImageSchema)
      .values(values)
      .returning();

    console.log(`Successfully inserted ${inserted.length} templates.`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
