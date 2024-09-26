import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const page = () => {
  return (
    <div className='overflow-y-hidden'>
      <div className="w-screen h-screen">
        <video autoPlay muted loop className="video-background">
          <source src="https://assets.mixkit.co/videos/24690/24690-720.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="flex sm:mx-10 md:flex-row gap-8 h-screen items-center justify-center">
          <Card className="h-[450px] w-[500px] border-none bg-black duration-200 hover:translate-y-[-10px] hover: shadow-md">
            <CardContent className="p-6">
              <div className="text-center flex flex-col gap-4">
                <Image
                  src={'/carrot_cup.webp'}
                  alt={'see sellers'}
                  width={500}
                  height={500}
                  className="object-cover h-[300px] w-[500px] rounded-lg"
                />
                <h2 className='text-2xl text-white'>Shop Cakes</h2>
                <Button><Link href={'/cakes/sellers'}>Go to cake shop</Link></Button>
              </div>
            </CardContent>
          </Card>
          <Card className="h-[450px] w-[500px] border-none bg-black duration-200 hover:translate-y-[-10px] hover: shadow-md">
            <CardContent className="p-6">
              <div className="text-center flex flex-col gap-4">
                <Image
                  src={'/strawberry_s.jpg'}
                  alt={'see sellers'}
                  width={500}
                  height={500}
                  className="object-cover h-[300px] w-[500px] rounded-lg"
                />
                <h2 className='text-2xl text-white'>See Cake Recipes</h2>
                <Button><Link href={'/cakes/recipes'}>Go to recipe catalogue</Link></Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}

export default page