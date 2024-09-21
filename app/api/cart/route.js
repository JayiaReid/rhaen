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

  const cartItem = await req.json();

  const query = `
    INSERT INTO cart (id, user_id, cake_id, quantity, price, size, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    cartItem.id,
    cartItem.user_id,
    cartItem.cake_id,
    cartItem.quantity,
    cartItem.price,
    cartItem.size,
    cartItem.notes,
  ];

  try {
    const res = await pool.query(query, values)
    return new Response(JSON.stringify({ message: 'cart item added!', cartItem: res.rows[0] }), {
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

    // const cartItem = await req.json()

    // const filePath = path.join(process.cwd(), "/app/api/cart/cart.json")
    
    // const fileData = await fs.readFile(filePath, "utf8")

    // const carts = JSON.parse(fileData)

    // carts.push(cartItem)

    // await fs.writeFile(filePath, JSON.stringify(carts, null, 2))

   
}

export async function GET(){
  const query = 'SELECT * FROM cart'
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
  

    // const filePath = path.join(process.cwd(), "/app/api/cart/cart.json")
    // const fileData = await fs.readFile(filePath, "utf8")
    // const carts=JSON.parse(fileData);
      
}

export async function DELETE(req) {
  const { id } = await req.json();

  const query = `
    DELETE FROM cart
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [id]);

    return new Response(JSON.stringify({ message: 'Cart item deleted!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error deleting cart item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}