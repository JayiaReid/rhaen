import { promises as fs } from "fs";
import path from "path";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

export async function POST(req){
  const review = await req.json()
  const query = ` INSERT INTO reviews (id, title, review) 
  VALUES ($1, $2, $3)
  RETURNING *;`

  const values = [
    review.id,
    review.title,
    review.review
  ]

  try {
    const res = await pool.query(query, values)
    return new Response(JSON.stringify({ message: 'review added!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({error: "error fetching"}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export async function GET(){
  const query = 'SELECT * FROM reviews'
  try {
    const res = await pool.query(query)
    return new Response(JSON.stringify(res.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({error: "error fetching"}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}