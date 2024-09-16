"use client"
import CardComp from '@/app/_components/Card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
import { LoaderPinwheelIcon } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { id } = useParams()
    const [cakes, setCakes] = useState([])
    const [recipes, setrecipes] = useState([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter]=useState('all')

    const fetchrecipes = async () => {
        const response = await fetch('/api/recipes')
        const data = await response.json()
        const filtered = data.filter(recipe =>
            recipe.name.toLowerCase().includes(id.toLowerCase()) ||
            recipe.description.toLowerCase().includes(id.toLowerCase())
        );
        setrecipes(filtered)
    }

    const fetchCakes = async () => {
        const response = await fetch('/api/cakes');
        const data = await response.json();
        const filtered = data.filter(cake =>
            cake.name.toLowerCase().includes(id.toLowerCase()) ||
            cake.description.toLowerCase().includes(id.toLowerCase())
        );
        setCakes(filtered);
        console.log(data)
    };

    useEffect(() => {
        fetchrecipes();
        fetchCakes();

        if (cakes && recipes) setLoading(false)
    }, [id])

    if (loading) return <div className='h-screen w-screen flex items-center justify-center'>
        <LoaderPinwheelIcon className='animate-spin' />
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
                            <BreadcrumbPage className="text-white">Search : {id}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className='p-5 flex gap-4'>
                {recipes.length>0 && cakes.length>0 ?<Button onClick={()=>setTypeFilter('all')} className={ `${typeFilter === "all"? 'bg-primary outline-none' : "bg-transparent outline"}`}>All</Button>: null}
                {cakes.length>0? <Button onClick={()=>setTypeFilter('sellers')} className={ `${typeFilter === "sellers"? 'bg-primary outline-none' : "bg-transparent outline"}`}>Sellers</Button> : null}
                {recipes.length>0? <Button onClick={()=>setTypeFilter('recipes')} className={ `${typeFilter === "recipes"? 'bg-primary outline-none' : "bg-transparent outline"}`}>Recipes</Button>: null}
            </div>

            {cakes.length > 0 && typeFilter!=="recipes" ? <div>
                <h2 className='text-primary p-5 underline text-xl'>Cakes for Sale</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 bg-black'>
                    {cakes.map((cake) => (
                        <CardComp key={cake.name} price={true} cake={cake}/>
                    ))}
                </div> </div> : null}
            {recipes.length > 0 && typeFilter!=="sellers" ? <div >
                <h2 className='text-primary underline p-5 text-xl'>Recipes</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 bg-black'>
                    {recipes.map((recipe) => (
                        <CardComp key={recipe.name} cake={recipe} price={false}/>
                    ))}
                </div>
            </div> : null}
        </div>
    )
}

export default page