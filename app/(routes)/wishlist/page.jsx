"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LoaderPinwheelIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import CardComp from '@/app/_components/Card'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Wishlist = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getItems = async () => {
    axios.get('/api/wishlist').then(res => {
      const data = res.data

      if (user && isLoaded) {
        const filteredItems = data.filter(item => item.user_id === user.id)
        console.log(filteredItems)
        setItems(filteredItems)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, user, router]);

  const deleteItem = async (id)=>{
    axios.delete('/api/wishlist', { data: { item_id: id } }).then(res=>{console.log(res, id); getItems()})
  }

  useEffect(() => {
    getItems()
  }, [user, isLoaded])

  if (loading) return <div className="h-auto w-auto flex items-center justify-center">
    <LoaderPinwheelIcon className="animate-spin text-primary" />
  </div>


  return (
    <div>
      <div className='p-5'>
        <Breadcrumb>
          <BreadcrumbList className="text-xl">
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-primary" href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-primary" href="/cakes">cakes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-primary" href="/cakes/sellers">sellers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">wishlist</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4'>
        {items.map((item, index) => (
          <div className='flex flex-col'>
            <CardComp cake={item} key={index} price={true} del={true} />
            <Button onClick={()=>{deleteItem(item.item_id)}} className="bg-transparent outline outline-primary relative mx-5 my-2">Delete</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist