import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    client.release();

    if (result.rows.length === 0) {
      return new Response('User not found', { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Database query failed', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { id, firstName, lastName, phone, email } = await req.json();

    if (!id || !firstName || !lastName || !phone || !email) {
      return new Response('Invalid input', { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO users (id, first_name, last_name, phone, email) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, firstName, lastName, phone, email]
    );
    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to add user', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
