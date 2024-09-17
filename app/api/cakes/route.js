// import fs from 'fs';
// import path from 'path';

// export async function GET() {
//   const filePath = path.join(process.cwd(), 'app/api/cakes/cakes.json');
//   const fileContent = fs.readFileSync(filePath, 'utf-8');
//   const cakes = JSON.parse(fileContent);
//   return new Response(JSON.stringify(cakes), {
//     headers: { 'Content-Type': 'application/json' },
//   });
// }
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
