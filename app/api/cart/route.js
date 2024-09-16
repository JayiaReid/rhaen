import { promises as fs } from "fs";
import path from "path";

export async function POST(req){

    const cartItem = await req.json()

    const filePath = path.join(process.cwd(), "/app/api/cart/cart.json")
    
    const fileData = await fs.readFile(filePath, "utf8")

    const carts = JSON.parse(fileData)

    carts.push(cartItem)

    await fs.writeFile(filePath, JSON.stringify(carts, null, 2))

    return new Response(JSON.stringify({ message: 'cart item added!' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
}

export async function GET(){
    const filePath = path.join(process.cwd(), "/app/api/cart/cart.json")
    const fileData = await fs.readFile(filePath, "utf8")
    const carts=JSON.parse(fileData);
      return new Response(JSON.stringify(carts), {
        headers: { 'Content-Type': 'application/json' },
      });
}

export async function DELETE(req) {
  const { id } = await req.json();

  const filePath = path.join(process.cwd(), "/app/api/cart/cart.json");

  const fileData = await fs.readFile(filePath, "utf8");
  const cart = JSON.parse(fileData);

  const updatedcart = cart.filter(item => item.id !== id);

  await fs.writeFile(filePath, JSON.stringify(updatedcart, null, 2));

  return new Response(JSON.stringify({ message: "cart item deleted!" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}