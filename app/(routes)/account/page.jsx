"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { UserButton, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { LoaderPinwheelIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import OrderItem from './_components/OrderItem'
import { Button } from '@/components/ui/button'

const userAccount = () => {

  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const [prevOrders, setPrevOrders] = useState([])
  const [currOrder, setCurrOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState(true)

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    } else {
      getOrder()
      setLoading(false)
    }
  }, [isSignedIn, user, router]);

  const getOrder = async () => {
    axios.get('/api/orders').then(res => {
      const filtered = res.data.filter(order => order.user_id == user.id)
      const sortedOrders = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const prevOrders = filtered.filter(order => order.status == "done")
      const currOrders = filtered.filter(order => order.status == "not started")
      setCurrOrders(currOrders)
      setPrevOrders(prevOrders)
      console.log(filtered)
    })
  }

  if (!user || loading) return <div className='h-screen w-screen items-center justify-center flex'>
    <LoaderPinwheelIcon className='text-primary animate-spin' />
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
              <BreadcrumbPage className="text-white">Account : {user.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='p-5'>
        <div className='col-span-3'>
          <h2 className='text-4xl my-6 text-primary flex items-center gap-4'><UserButton />Welcome {user.fullName}!</h2>

          <div>
            <div className='flex gap-2 my-4'>
              <Button onClick={() => setType(true)} className={`${type == true ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Current Orders</Button>
              <Button onClick={() => setType(false)} className={`${type == false ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Previous Orders</Button>
            </div>

            {type ? (
              <div className='h-auto'>
                {/* <h2 className='text-2xl text-primary my-4'>Current Orders</h2> */}
                <div className='flex flex-wrap gap-4'>
                  {currOrder.map((order) => (
                    <div key={order.id} className='flex-1 min-w-[300px]'>
                      <OrderItem order={order} curr={true} refreshData={()=>getOrder()} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* <h2 className='text-2xl text-primary my-4'>Previous Orders</h2> */}
                <div className='flex flex-wrap gap-4'>
                  {prevOrders.map((order) => (
                    <div key={order.id} className='flex-1 min-w-[300px]'>
                      <OrderItem order={order} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
        </div>
        <div className='my-4'>
          <h2 className='text-primary font-extralight text-2xl'>Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className='text-white text-2xl grid grid-cols-4 gap-3'>
            <AccordionItem value="item-1">
              <AccordionTrigger>Can I edit my orders?</AccordionTrigger>
              <AccordionContent>
                Not neccessarily. You can contact the store referencing the order id to add notes to your order but as for size, quantity and cake type, no.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I request a change of date of delivery/pick up?</AccordionTrigger>
              <AccordionContent>
                Yes, call or email the store to talk to an employee.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I specify allergies?</AccordionTrigger>
              <AccordionContent>
                Yes, add it to the notes! we will find an alternative that works.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Are the cakes good?</AccordionTrigger>
              <AccordionContent>
                Yes!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* wishlist api
      {/* previous orders */}

      {/* pending orders */}

    </div>
  )
}

export default userAccount