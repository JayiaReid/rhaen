import { promises as fs } from "fs";
import path from "path";

export async function POST(req){

    const wishlistItem = await req.json()

    const filePath = path.join(process.cwd(), "/app/api/wishlist/wishlist.json")
    
    const fileData = await fs.readFile(filePath, "utf8")

    const wishlists = JSON.parse(fileData)

    wishlists.push(wishlistItem)

    await fs.writeFile(filePath, JSON.stringify(wishlists, null, 2))

    return new Response(JSON.stringify({ message: 'wishlist item added!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}

export async function GET(){
    const filePath = path.join(process.cwd(), "/app/api/wishlist/wishlist.json")
    const fileData = await fs.readFile(filePath, "utf8")
    const wishlists=JSON.parse(fileData);
      return new Response(JSON.stringify(wishlists), {
        headers: { 'Content-Type': 'application/json' },
      });
}

export async function DELETE(req) {
  const { item_id } = await req.json();

  const filePath = path.join(process.cwd(), "/app/api/wishlist/wishlist.json");

  const fileData = await fs.readFile(filePath, "utf8");
  const wishlists = JSON.parse(fileData);

  const updatedWishlists = wishlists.filter(item => item.item_id !== item_id);

  await fs.writeFile(filePath, JSON.stringify(updatedWishlists, null, 2));

  return new Response(JSON.stringify({ message: "wishlist item deleted!" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
