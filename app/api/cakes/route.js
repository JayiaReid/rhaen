import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'app/api/cakes/cakes.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const cakes = JSON.parse(fileContent);
  return new Response(JSON.stringify(cakes), {
    headers: { 'Content-Type': 'application/json' },
  });
}