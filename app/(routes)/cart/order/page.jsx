"use client"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { LoaderPinwheelIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import CartItem from '../_components/CartItem'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'


const page = () => {
    const { user, isLoaded, isSignedIn } = useUser()
    const [items, setItems] = useState([])
    const [Subtotal, setSubTotal] = useState(0)
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [delivery, setDelivery] = useState(false)
    const [readyDate, setReadyDate] = useState(null)
    const [fee, setFee] = useState(0)
    const [address, setAddress] = useState("")
    const [total, setTotal] = useState(0)

    const router = useRouter()

    // Calculate the ready date based on items' quantity
    useEffect(() => {
        let totalQuan = 0

        items.forEach(item => {
            totalQuan += Number(item.quantity)
        })

        // Logic for calculating the ready date
        let additionalDays = Math.floor(totalQuan / 3) * 2;
        let today = new Date();
        let minReady = new Date(today);
        minReady.setDate(minReady.getDate() + 14 + additionalDays); // Adds 14 days + extra days
        setReadyDate(minReady); // Set the calculated ready date
    }, [items])

    const getItems = async () => {
        axios.get('/api/cart').then(res => {
            const data = res.data

            if (user && isLoaded) {
                const filteredItems = data.filter(item => item.user_id === user.id)
                console.log(filteredItems)
                setItems(filteredItems)
                let total = 0
                let count = 0

                filteredItems.forEach(item => {
                    total += Number(item.price)
                    count++
                })
                setSubTotal(total)
                setCount(count)

                setLoading(false)
            }
        })
    }

    useEffect(() => {
        getItems()
    }, [user, isLoaded])

    useEffect(() => {
        setTotal(fee + Subtotal + (0.03 * Subtotal))
    }, [Subtotal, fee])

    if (loading) return <div className="h-auto w-auto flex items-center justify-center">
        <LoaderPinwheelIcon className="animate-spin text-primary" />
    </div>

    return (
        <div className=''>
            <div className='p-5'>
                <Breadcrumb>
                    <BreadcrumbList className="text-xl">
                        <BreadcrumbItem>
                            <BreadcrumbLink className="hover:text-primary" href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="hover:text-primary" href="/cart">cart</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-white">order</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className='flex justify-between gap-2 p-5'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-4 items-center justify-start'>
                            <Button onClick={() => { setDelivery(true); setFee(20) }} className={`${delivery === true ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Delivery (Fee: $20)</Button>
                            <Button onClick={() => { setDelivery(false); setFee(0) }} className={`${delivery === false ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Pick Up</Button>
                        </div>
                        <div>
                            {delivery ? <div>
                                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeHolder="Enter Delivery Address here" />
                            </div> : null}
                        </div>
                        <div className='text-white'>
                            <Calendar
                                mode="single"
                                selected={readyDate}
                                onSelect={(date) => setReadyDate(date)}
                                className="rounded-lg w-[250px] border"
                            />
                            <h2 className='text-white my-4'>Date of {delivery ? 'delivery' : 'pick-up'}: {readyDate?.toLocaleDateString()}</h2>
                        </div>
                    </div>
                    <h2 className='text-primary text-3xl'>Order Items</h2>
                    <ScrollArea className='w-full h-[250px] overflow-x-auto'>
                        <div className='flex gap-4'>
                            {items.map((item, key) => (
                                <CartItem
                                    noextra={true}
                                    item={item}
                                    refreshData={getItems}
                                    key={key}
                                    className="min-w-[200px] w-auto"
                                />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <div className='flex flex-col gap-4'>


                </div>
                <div className='w-[500px] h-[320px] border m-5 rounded-lg p-3 justify-evenly flex flex-col gap-4'>
                    <h2 className='text-primary text-3xl'>Order Summary</h2>
                    <h2 className='text-white flex items-center justify-between text-xl'><span>Subtotal:</span><span>CA${Subtotal}</span> </h2>
                    <h2 className='text-white flex items-center justify-between text-xl'><span>Delivery Fee:</span><span>CA${fee}</span> </h2>
                    <h2 className='text-white flex items-center justify-between text-xl'><span>Taxes:</span><span>CA${Number(0.03 * Subtotal)}</span> </h2>
                    <hr />
                    <h2 className='text-white flex items-center justify-between text-2xl'><span className='font-bold'>Grand Total: </span><span className='font-extrabold text-primary'>CA${total}</span> </h2>
                    <Button className='my-2'>Confirm Order</Button>
                </div>
            </div>
        </div>
    )
}

export default page
