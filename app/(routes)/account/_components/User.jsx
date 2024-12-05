"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { UserButton, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { LoaderPinwheelIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import OrderItem from './OrderItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const UserAccount = () => {

  const { user, isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [prevOrders, setPrevOrders] = useState([])
  const [currOrder, setCurrOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState(true)
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [phone, setPhone] = useState('')
  const [notfound, setNotFound] = useState(false)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    } else {
      if(user){
        checkUserExists()
      }
      
      getOrder()
      // setLoading(false)
    }
  }, [isSignedIn, isLoaded, user]);

  const checkUserExists = async () => {
    try {
      const response = await axios.get(`/api/user?id=${user?.id}`);
      setUserData(response.data)
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound(true)
      }
      console.error('Error checking user:', error.message);
      throw error; 
    }
  };

  const createUser = async ()=>{
    const userData = {
      id: user?.id,
      email: user?.emailAddresses[0],
      firstName: first,
      lastName: last,
      phone
    }

    try {
      axios.post('/api/user', userData)
    } catch (error) {
      console.error(error)
    }
    
  }

  const getOrder = async () => {
    axios.get('/api/orders').then(res => {
      const filtered = res.data.filter(order => order.user_id == user.id)
      // const sortedOrders = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const prevOrders = filtered.filter(order => order.status == "done")
      const currOrders = filtered.filter(order => order.status !== "done")
      setCurrOrders(currOrders)
      setPrevOrders(prevOrders)
    })
  }

//   if (!user || loading) return <div className='h-screen w-screen items-center justify-center flex'>
//     <LoaderPinwheelIcon className='text-primary animate-spin' />
//   </div>

  return (
    // set up user with phone number, first name, last name, email
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
          {notfound && <form className='p-5 border rounded-xl'>
            <h2 className='text-white font-bold text-xl'>Finish User Set Up</h2>
        <div className='text-white flex  gap-5 mt-5'><Label htmlFor="firstName" className='text-white'>First Name:</Label>
        <Input
          type="text"
          id="firstName"
          name="firstName"
          value={first}
          onChange={setFirst}
          required
        />
        <Label htmlFor="lastName">Last Name:</Label>
        <Input
          type="text"
          id="lastName"
          name="lastName"
          value={last}
          onChange={setLast}
          required
        />
      </div>
      <div className='text-white flex  gap-5 my-5'>
        <Label htmlFor="phone">Phone:</Label>
        <Input
          type="text"
          id="phone"
          name="phone"
          value={phone}
          onChange={setPhone}
          required
        />
        <Label htmlFor="email" >Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={user?.emailAddresses[0]}
          readOnly
        />
      </div>

      <Button className='' onClick={()=>createUser()} type="submit" >Submit</Button>
    </form>}
          <div>
            <div className='flex gap-2 my-6'>
              <Button onClick={() => setType(true)} className={`${type == true ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Current Orders</Button>
              <Button onClick={() => setType(false)} className={`${type == false ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Previous Orders</Button>
            </div>

            {type ? (
              <div className='h-auto'>
                {/* <h2 className='text-2xl text-primary my-4'>Current Orders</h2> */}
                {currOrder.length>0? <div className='flex flex-wrap gap-4'>
                  {currOrder.map((order) => (
                    <div key={order.id} className='flex-1 min-w-[300px]'>
                      <OrderItem order={order} curr={true} refreshData={()=>getOrder()} />
                    </div>
                  ))}
                </div>: <h2 className='text-center text-xl text-white py-10'>No orders yet.</h2>}
              </div>
            ) : (
              <div>
                {/* <h2 className='text-2xl text-primary my-4'>Previous Orders</h2> */}
                {prevOrders.length> 0? <div className='flex flex-wrap gap-4'>
                  {prevOrders.map((order) => (
                    <div key={order.id} className='flex-1 min-w-[300px]'>
                      <OrderItem order={order} />
                    </div>
                  ))}
                </div>:  <h2 className='text-center text-xl text-white py-10'>No orders yet.</h2> }
              </div>
            )}
          </div>
        </div>
        <div>
        </div>
        <div className='my-4'>
          <h2 className='text-primary font-extralight text-2xl'>Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className='text-white text-2xl grid grid-cols-2 gap-5'>
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
            <AccordionItem value="item-1">
              <AccordionTrigger>Can I cancel my orders?</AccordionTrigger>
              <AccordionContent>
                Yes or No. If we have started to process your order, No. If we haven't, yes. Contact the store.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How long does it take to process an order?</AccordionTrigger>
              <AccordionContent>
                Same day, typically. We order supplies based on orders. However, if the DOD is a month or two away then 2-3 weeks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I make custom orders?</AccordionTrigger>
              <AccordionContent>
                Yes, call to order custom cakes or if it is not too customized add it to the notes in your order.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is it true you give away free cakes for the holidays?</AccordionTrigger>
              <AccordionContent>
              100%
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

export default UserAccount