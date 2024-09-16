import { promises as fs } from "fs";
import path from "path";

export async function POST(req){
// status 500
    const rating = await req.json()

    const filePath = path.join(process.cwd(), "/app/api/ratings/ratings.json")
    
    const fileData = await fs.readFile(filePath, "utf8")

    const ratings = JSON.parse(fileData)

    ratings.push(rating)

    await fs.writeFile(filePath, JSON.stringify(ratings, null, 2))

    return new Response(JSON.stringify({ message: 'rating added successfully!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}

export async function GET(){
    const filePath = path.join(process.cwd(), "/app/api/ratings/ratings.json")
    const fileData = await fs.readFile(filePath, "utf8")
    const ratings=JSON.parse(fileData);
      return new Response(JSON.stringify(ratings), {
        headers: { 'Content-Type': 'application/json' },
      });
}