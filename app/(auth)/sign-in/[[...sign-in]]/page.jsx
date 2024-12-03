"use client"
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Page() {

  const router = useRouter()
  const previousUrl = router.back()

  return <div className='flex  p-10 bg-no-repeat items-center justify-left h-[750px] gap-8 '>
    <div className="w-screen sm:hidden lg:block">
        <video autoPlay muted loop className="fixed top-0 left-0 min-w-[100%] object-fill z-[-1]">
          <source src="https://assets.mixkit.co/videos/41108/41108-720.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      <SignIn afterSignInUrl={'/account'} signUpUrl='/sign-up'/>
    </div>
    </div>
}