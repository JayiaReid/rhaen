"use client"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CartItem from './_components/CartItem'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LoaderPinwheelIcon } from 'lucide-react'

const Cart = () => {
  // const [delivery, setDel] = useState(false)
  // const [fee, setFee] = useState(0)
  const { user, isLoaded } = useUser()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const getItems = async () => {
    axios.get('/api/cart').then(res => {
      const data = res.data

      if (user && isLoaded) {
        const filteredItems = data.filter(item => item.user_id === user.id)
        console.log(filteredItems)
        setItems(filteredItems)
        let total = 0
        let count = 0
        items.forEach(item => {
          total += Number(item.price)
          count++
        })
        setTotal(total)
        setCount(count)
        setLoading(false)
      }
    })
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
              <BreadcrumbPage className="text-white">cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1'>
        <div className='flex flex-col gap-4'>
          {items.map((item, key) => (
            <CartItem item={item} refreshData={() => getItems()} />
          ))}
        </div>
        <div className='h-[200px] border m-5 rounded-lg p-3 justify-evenly flex flex-col gap-4'>
          <h2 className='text-primary text-3xl'>Order Summary</h2>
          <h2 className='text-white text-right text-2xl'>CA${total}</h2>
          <Button className='w-full'>Checkout ({count})</Button>
        </div>
      </div>
    </div>

  )
}

export default Cart