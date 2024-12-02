import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM cakes');
    const cakes = result.rows;
    client.release();

    return new Response(JSON.stringify(cakes), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Database query failed', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { id, name, description, image, price, small, medium, large } = await req.json();

    if (!id || !name || !description || !image || !price || !small || !medium || !large) {
      return new Response('Invalid input', { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO cakes (id, name, description, image, price, small, medium, large) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, name, description, image, price, small, medium, large]
    );
    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to add cake', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const { id, name, description, image, price, small, medium, large } = await req.json();

    if (!id || !name || !description || !image || !price || !small || !medium || !large) {
      return new Response('Invalid input', { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE cakes 
       SET name = $1, description = $2, image = $3, price = $4, small = $5, medium = $6, large = $7 
       WHERE id = $8 RETURNING *`,
      [name, description, image, price, small, medium, large, id]
    );
    client.release();

    if (result.rowCount === 0) {
      return new Response('Cake not found', { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to update cake', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response('Invalid input', { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query('DELETE FROM cakes WHERE id = $1 RETURNING *', [id]);
    client.release();

    if (result.rowCount === 0) {
      return new Response('Cake not found', { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Cake deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to delete cake', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
