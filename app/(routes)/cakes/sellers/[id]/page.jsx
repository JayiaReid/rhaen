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
    const [cake, setCake] = useState({})
    const [loading, setLoading] = useState(true)

    const fetchCakes = async () => {
        const response = await fetch('/api/cakes');
        const data = await response.json();
        const filtered = data.filter(cake =>
            cake.id == id
        );
        setCake(filtered[0]);
        console.log(data)
    };

    useEffect(() => {
        fetchCakes().then(() => setLoading(false));
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
                            <BreadcrumbLink className="hover:text-primary" href="/cakes/sellers">sellers</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-white">{cake.id}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className='flex justify-center gap-10 p-5'> 
                <Card key={cake.id} className="h-[900px] w-[800px] border-none bg-black duration-200">
                    <CardContent className="p-6">
                        <div className="text-center">
                            {cake.image ? (
                                <Image
                                    src={cake.image}
                                    alt={cake.name}
                                    width={500}
                                    height={500}
                                    className="object-cover h-[600px] w-[800px] rounded-lg"
                                />
                            ) : (
                                <span className="text-3xl font-semibold">{cake.name}</span>
                            )}

                        </div>
                    </CardContent>
                </Card>
                <Details cake={cake} />
            </div>
            
        </div>
    )
}

export default page