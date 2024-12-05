
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(req) {
  const order = await req.json();

  const query = `
    INSERT INTO orders (user_id, cart_items, total_price, delivery, ready_date, status, address, user_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    order.user_id,
    JSON.stringify(order.cart_items),
    order.total_price,
    order.delivery,
    order.ready_date,
    order.status || 'not started',
    order.address,
    order.user_name
  ];

  try {
    const res = await pool.query(query, values);
    return new Response(JSON.stringify({ message: 'Order created!', order: res.rows[0] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error creating order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  const query = 'SELECT * FROM orders';
  try {
    const res = await pool.query(query);
    
    return new Response(JSON.stringify(res.rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  const query = `
    DELETE FROM orders
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [id]);
    return new Response(JSON.stringify({ message: 'Order deleted!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error deleting order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return new Response(JSON.stringify({ error: 'Order ID and status are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const query = `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [status, id]);
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Order updated!', order: res.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error updating order' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
