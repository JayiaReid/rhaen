import { promises as fs } from "fs";
import path from "path";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


export async function POST(req) {
  const wishlistItem = await req.json();

  const query = `
    INSERT INTO wishlist (item_id, user_id, id, name, description, image, price, small, medium, large)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    wishlistItem.item_id,
    wishlistItem.user_id,
    wishlistItem.id,
    wishlistItem.name,
    wishlistItem.description,
    wishlistItem.image,
    wishlistItem.price,
    wishlistItem.small,
    wishlistItem.medium,
    wishlistItem.large
  ];

  try {
    const res = await pool.query(query, values);
    return new Response(JSON.stringify({ message: 'Wishlist item added!', wishlistItem: res.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error adding item to wishlist' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function GET() {
  const query = 'SELECT * FROM wishlist';

  try {
    const res = await pool.query(query);
    return new Response(JSON.stringify(res.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching wishlist items' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function DELETE(req) {
  const { item_id } = await req.json();

  const query = `
    DELETE FROM wishlist
    WHERE item_id = $1
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [item_id]);

    return new Response(JSON.stringify({ message: 'Wishlist item deleted!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error deleting wishlist item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
