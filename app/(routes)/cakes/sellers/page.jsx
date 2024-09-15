"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { LoaderPinwheelIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [cakes, setCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('asc')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    const fetchCakes = async () => {
      const response = await fetch('/api/cakes')
      const data = await response.json()
      setCakes(data)
      setLoading(false)
    }

    fetchCakes()
  }, [])

  const handleSortChange = (e) => {
    setSortOrder(e.target.value)
  }

  const handleFilterChange = (e) => {
    setPriceRange(e.target.value)
  }

  const filteredCakes = cakes
    .filter((cake) => {
      if (priceRange === 'less_than_30') return cake.price < 30
      if (priceRange === 'between_30_50') return cake.price >= 30 && cake.price <= 50
      if (priceRange === 'more_than_50') return cake.price > 50
      return true
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price
      if (sortOrder === 'desc') return b.price - a.price
      return 0
    })

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
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cakes">Cakes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">sellers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="p-5 flex justify-between items-center">
        <div>
          <label htmlFor="sort" className="text-white mr-2">Sort by price:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={handleSortChange}
            className="bg-secondary text-secondary-foreground p-2 rounded"
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter" className="text-white mr-2">Filter by price range:</label>
          <select
            id="filter"
            value={priceRange}
            onChange={handleFilterChange}
            className="bg-secondary text-secondary-foreground p-2 rounded"
          >
            <option value="all">All</option>
            <option value="less_than_30">Less than $30</option>
            <option value="between_30_50">$30 - $50</option>
            <option value="more_than_50">More than $50</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 bg-black'>
        {filteredCakes.map((cake) => (
          <Card key={cake.name} className="h-[600px] w-full border-none bg-black duration-200 hover:translate-y-[-10px] hover:shadow-md">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                {cake.image ? (
                  <Image
                    src={cake.image}
                    alt={cake.name}
                    width={500}
                    height={500}
                    className="object-cover w-[500px] h-[500px] rounded-lg"
                  />
                ) : (
                  <span className="text-3xl font-semibold">{cake.name}</span>
                )}
                <h2 className="text-primary font-bold text-lg">{cake.name}</h2>
                <h2 className="text-primary-foreground">{cake.description}</h2>
                <p className="text-primary font-bold text-lg">${cake.price.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
