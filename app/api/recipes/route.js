import { promises as fs }  from 'fs'
import path from 'path'

export async function GET(){
    const filePath = path.join(process.cwd(), "/app/api/recipes/recipes.json")
    const fileData = await fs.readFile(filePath, "utf8")
    const recipes=JSON.parse(fileData);
      return new Response(JSON.stringify(recipes), {
        headers: { 'Content-Type': 'application/json' },
      });
}