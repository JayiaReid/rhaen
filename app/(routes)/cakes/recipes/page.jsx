"use client"
import CardComp from '@/app/_components/Card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { LoaderPinwheelIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [recipes, setrecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchrecipes = async () => {
      const response = await fetch('/api/recipes')
      const data = await response.json()
      setrecipes(data)
      setLoading(false)
    }

    fetchrecipes()
  }, [])

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <LoaderPinwheelIcon className='animate-spin' />
      </div>
    )
  }

  return (
    <div className='bg-black h-auto mb-0'>
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
              <BreadcrumbPage className="text-white">recipes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 bg-black'>
        {recipes.map((recipe) => (
          <CardComp cake={recipe} price={false} key={recipe.id}/>
        ))}
      </div>
    </div>
  )
}

export default Page
