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
import UserAccount from './_components/User'
import Admin from './_components/Admin'

const Page = () => {

  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('user')

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    } else {
      if(user?.id == 'user_2pdjpky3ST2ETo1eABFkXG3xXUi'){
        setType('admin')
      }
      // getOrder()
      setLoading(false)
    }
  }, [isSignedIn, user, router]);


  if (!user || loading) return <div className='h-screen w-screen items-center justify-center flex'>
    <LoaderPinwheelIcon className='text-primary animate-spin' />
  </div>

  return (
    <div>
      {user?.id == 'user_2pdjpky3ST2ETo1eABFkXG3xXUi' && <div className=' flex gap-5 p-5'>
        <Button
            onClick={() => setType("user")}
            className={`${
              type == "user"
                ? "bg-primary outline-none"
                : "bg-transparent outline outline-secondary-foreground"
            }`}
          >
            User
          </Button>
          <Button
            onClick={() => setType("admin")}
            className={`${
              type == "admin"
                ? "bg-primary outline-none"
                : "bg-transparent outline outline-secondary-foreground"
            }`}
          >
            Admin
          </Button>
        </div>}
      {type=='admin' && user?.id == 'user_2pdjpky3ST2ETo1eABFkXG3xXUi' &&  <Admin/>}
      {type=='user' &&  <UserAccount/>}
      
    </div>
    
  )
}

export default Page