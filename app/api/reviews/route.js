import { promises as fs } from "fs";
import path from "path";

export async function POST(req){

    const review = await req.json()

    const filePath = path.join(process.cwd(), "/app/api/reviews/reviews.json")
    
    const fileData = await fs.readFile(filePath, "utf8")

    const reviews = JSON.parse(fileData)
    reviews.push(review)

    await fs.writeFile(filePath, JSON.stringify(reviews, null, 2))

    return new Response(JSON.stringify({ message: 'review added successfully!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}

export async function GET(){
    const filePath = path.join(process.cwd(), "/app/api/reviews/reviews.json")
    const fileData = await fs.readFile(filePath, "utf8")
    const reviews=JSON.parse(fileData);
      return new Response(JSON.stringify(reviews), {
        headers: { 'Content-Type': 'application/json' },
      });
}