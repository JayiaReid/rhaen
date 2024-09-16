"use client"
import { Card, CardContent } from '@/components/ui/card';
import { LoaderPinwheelIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Details from '../../_components/Details';


const page = () => {

    const { id } = useParams();
    const [recipe, setrecipe] = useState({})
    const [loading, setLoading] = useState(true)

    const fetchrecipes = async () => {
        const response = await fetch('/api/recipes');
        const data = await response.json();
        const filtered = data.filter(recipe =>
            recipe.id == id
        );
        setrecipe(filtered[0]);
        console.log(data)
    };

    useEffect(() => {
        fetchrecipes().then(() => setLoading(false));
    }, [])

    if (loading) {
        return (
            <div className='h-screen w-screen flex items-center justify-center'>
                <LoaderPinwheelIcon className='animate-spin' />
            </div>
        )
    }

    return (
        <div className='max-h-screen'>
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
                            <BreadcrumbLink className="hover:text-primary" href="/cakes/recipes">recipes</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-white">{recipe.id}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className='flex justify-center gap-10 p-5 items-center'>
                
            <Card key={recipe.id} className="h-[600px] w-[800px] border-none bg-black duration-200">
                    <CardContent className="p-6">
                        <div className="text-center flex items-center">
                            {recipe.image ? (
                                <Image
                                    src={recipe.image}
                                    alt={recipe.name}
                                    width={500}
                                    height={500}
                                    className="object-cover h-[600px] w-[800px] rounded-lg"
                                />
                            ) : (
                                <span className="text-3xl font-semibold">{recipe.name}</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <div className="flex h-[600px] flex-col p-6 gap-8 text-white w-[600px]">
                    <h2 className="text-primary text-2xl font-bold">{recipe.name}</h2>
                    <h2 className="font-bold text-xl text-white underline">Ingredients</h2>
                    <ul className="text-secondary text-lg">
                        {recipe.ingredients.map((item, key) => (
                            <li key={key}>{item}</li>
                        ))}
                    </ul>
                    <h2 className="font-bold text-xl text-white underline">Instructions</h2>
                    <ul className="text-secondary text-lg">
                        {recipe.instructions.map((item, key) => (
                            <li key={key}>{item}</li>
                        ))}
                    </ul>
                </div>
               

            </div>

        </div>
    )
}

export default page