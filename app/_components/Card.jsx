import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CardComp = ({cake, price}) => {
  return (
    <Link href={`/cakes/${cake.price? 'sellers' : "recipes"}/${cake.id}`}>
      <Card className="h-[600px] w-full border-none bg-black duration-200 hover:translate-y-[-10px] hover:shadow-md">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            {cake.image ? (
              <Image
                src={cake.image}
                alt={cake.name}
                width={600}
                height={600}
                className="object-cover w-[500px] h-[500px] rounded-lg"
              />
            ) : (
              <span className="text-3xl font-semibold">{cake.name}</span>
            )}
            <h2 className="text-primary font-bold text-lg">{cake.name}</h2>
            <h2 className="text-primary-foreground">{cake.description}</h2>
            {price? <h2 className="text-primary font-bold text-lg">${cake.price}</h2>:null}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CardComp