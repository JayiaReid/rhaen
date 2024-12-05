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
import { toast } from '@/hooks/use-toast'
import emailjs from '@emailjs/browser'

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
    const [state, setState] = useState(0)
    const [minReady, setMin] = useState(null)
    const [orderInfo, setOrderInfo]=useState([])

    const router = useRouter()

    useEffect(() => {
        let totalQuan = 0

        items.forEach(item => {
            totalQuan += Number(item.quantity)
        })

        let additionalDays = Math.floor(totalQuan / 3) * 2;
        let today = new Date();
        let minReady = new Date(today);
        minReady.setDate(minReady.getDate() + 14 + additionalDays);
        setReadyDate(minReady);
        setMin(minReady)
    }, [items])

    const setOrder = ()=>{

        items.forEach(item=>{
            let info = {
                cake_id: item.cake_id,
                size: item.size,
                quantity: item.quantity,
                notes: item.notes,
                price: item.price,
                user: user.fullName,
                order_id: item.id
            }
            orderInfo.push(info)
        })

    }

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

    const placeOrder = async () => {
        const confirmation = confirm('Confirm Purchase?')
        if (confirmation) {
            axios.post('/api/orders', {
                user_id: user.id,
                cart_items: items,
                total_price: total,
                delivery: delivery,
                ready_date: readyDate,
                address: address,
                user_name: user.fullName
            }).then(res => {
                console.log(res)
                toast({
                    title: "Order Placed",
                    description: `Order will be ready ${readyDate.toLocaleDateString()}. you will be emailed about further details when order is ready. Go to account to see order details.`,
                })

                setOrder()
                
                emailjs.send("Rhaen", "template_o6ezvob", {
                    from_name: user.fullName,
                    user_id: user.id,
                    cart_items: JSON.stringify(orderInfo),
                    total_price: total,
                    delivery: delivery,
                    ready_date: readyDate,
                    address: address? address: 'no address: pick up',
                    status: "not started"
                }, "DgZmTosms004jCTIi")
                items.forEach(item => {
                    axios.delete('/api/cart', { data: { id: item.id } }).then(res => {
                        console.log(res)
                        router.push('/')
                    })
                })

            })
        }

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
                        <BreadcrumbSeparator />
                        {state == 0 ? <BreadcrumbItem>
                            <BreadcrumbPage className="text-white">Delivery Info</BreadcrumbPage>
                        </BreadcrumbItem> : <BreadcrumbItem>
                            <BreadcrumbPage className="text-white">Confirm Order</BreadcrumbPage>
                        </BreadcrumbItem>}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className='p-5 flex justify-between gap-6'>
                <div className='flex flex-col gap-4 items-start justify-center'>
                    {state == 0 ? <div className='flex items-center justify-center rounded-lg flex-col gap-6 border p-5'>
                        <h2 className='text-xl text-primary mt-4'>Select Delivery Type and Desired Ready Date </h2>
                        <h2 className='text-sm text-white'>Nb: The earliest date for {delivery ? 'delivery' : 'pick-up'} is {minReady?.toLocaleDateString()}</h2>
                        <div className='flex gap-4 items-center justify-start'>
                            <Button onClick={() => { setDelivery(true); setFee(20) }} className={`${delivery === true ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}  h-8 p-4 text-lg`}>Delivery (Fee: $20)</Button>
                            <Button onClick={() => { setDelivery(false); setFee(0) }} className={`${delivery === false ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"} h-8 p-4 text-lg`}>Pick Up</Button>
                        </div>
                        <div>
                            {delivery ? <div>
                                <Textarea className='text-white w-[300px]' value={address} onChange={(e) => setAddress(e.target.value)} placeHolder="Enter Delivery Address here" />
                            </div> : null}
                        </div>
                        <div className='text-white'>
                            <Calendar
                                mode="single"
                                selected={readyDate}
                                onSelect={(date) => setReadyDate(date)}
                                className="rounded-lg w-[250px] border"
                            />
                            <h2 className='text-white mt-4'>Date of {delivery ? 'delivery' : 'pick-up'}: {readyDate?.toLocaleDateString()}</h2>
                        </div>
                        <Button disabled={delivery && !address} onClick={() => setState(1)}>Next</Button>
                    </div> : <div className='w-[500px] h-[400px] border m-5 rounded-lg p-3 justify-evenly flex flex-col gap-4'>
                        <h2 className='text-primary text-3xl'>Order Summary</h2>
                        <h2 className='text-white flex items-center justify-between text-xl'><span>Address:</span><span>{delivery ? address : ' (pick-up)'}</span> </h2>
                        <h2 className='text-white flex items-center justify-between text-xl'><span>Subtotal:</span><span>CA${Subtotal.toFixed(2)}</span> </h2>
                        <h2 className='text-white flex items-center justify-between text-xl'><span>Delivery Fee:</span><span>CA${fee} </span> </h2>
                        <h2 className='text-white flex items-center justify-between text-xl'><span>Taxes:</span><span>CA${Number(0.03 * Subtotal).toFixed(2)}</span> </h2>
                        <hr />
                        <h2 className='text-white flex items-center justify-between text-2xl'><span className='font-bold'>Grand Total: </span><span className='font-extrabold text-primary'>CA${total.toFixed(2)}</span> </h2>
                        <div className='flex gap-2 items-center'>
                            <Button onClick={() => setState(0)} variant="outline">Back</Button>
                            <Button onClick={() => placeOrder()} className='my-2'>Confirm Order</Button>
                        </div>
                    </div>}
                </div>
                <div>
                    <h2 className='text-primary text-3xl'>Items for Order</h2>
                    <ScrollArea className='w-[900px] h-[350px] overflow-x-hidden'>
                        <div className='flex gap-2'>
                            {items.map((item, key) => (
                                <CartItem
                                    noextra={true}
                                    item={item}
                                    refreshData={getItems}
                                    key={key}
                                    className="w-full"
                                />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

            </div>
        </div>
    )
}

export default page
