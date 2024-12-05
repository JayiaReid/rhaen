import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM recipes');
    const recipes = result.rows;
    client.release();
    
    return new Response(JSON.stringify(recipes), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Database query failed', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
