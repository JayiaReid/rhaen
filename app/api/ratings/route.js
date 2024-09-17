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
    const rating = await req.json()
    const query = ` INSERT INTO ratings (id, cake_id, rating) 
    VALUES ($1, $2, $3)
    RETURNING *;`

    const values = [
      rating.id,
      rating.cake_id,
      rating.rating
    ]

    try {
      const res = await pool.query(query, values)
      return new Response(JSON.stringify({ message: 'rating added!' }), {
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

    // const filePath = path.join(process.cwd(), "/app/api/ratings/ratings.json")
    
    // const fileData = await fs.readFile(filePath, "utf8")

    // const ratings = JSON.parse(fileData)

    // ratings.push(rating)

    // await fs.writeFile(filePath, JSON.stringify(ratings, null, 2))

    // return new Response(JSON.stringify({ message: 'rating added successfully!' }), {
    //     status: 200,
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
}

export async function GET(){
  const query = 'SELECT * FROM ratings'
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