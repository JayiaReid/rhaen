"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { UserButton, useUser } from '@clerk/nextjs'
import { LoaderPinwheelIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const userAccount = () => {

  const {user, isSignedIn} = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, user, router]);

  if(!user) return <div className='h-screen w-screen items-center justify-center flex'>
    <LoaderPinwheelIcon className='text-primary animate-spin'/>
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
      {/* wishlist api */}
      {/* previous orders */}
      {/* pending orders */}
    </div>
  )
}

export default userAccount