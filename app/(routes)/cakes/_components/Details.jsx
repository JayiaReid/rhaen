"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { HeartIcon, LoaderPinwheelIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

const Details = ({ cake }) => {
    const {user} = useUser()
    const [price, setPrice] = useState(cake.price)
    const [size, setSize] = useState(null)
    const [extra, setExtra] = useState('')
    const [quan, setQuan] = useState(0)
    const [subtotal, setSubTotal] = useState(0)
    const [avg_rating, setAvg] = useState(0)
    const [num_ratings, SetNum] = useState(0)
    const [total_ratings, setTotal] = useState(0)
    const [rate, setRate]=useState(0)
    const router = useRouter()

    const addToCart = async ()=>{
        axios.post('/api/cart',{
            id: Date.now(),
            user_id: user.id,
            cake_id: cake.id,
            quantity: quan,
            price: subtotal,
            size: size,
            notes: extra,
        }).then(res=>{
            toast({
                title: "Item added to cart",
                description: "ps: you can edit order in cart"
            })
            setSize(null)
            setSubTotal(0)
            setPrice(cake.price)
            setExtra('')
            router.push('/cart')
        })
    }

    useEffect(() => {
        setSubTotal((price * quan).toFixed(2))
    }, [price, quan])

    useEffect(() => {
        getRating()
    }, [])

    const getRating = async () => {
        const response = await fetch('/api/ratings');
        const data = await response.json();
        console.log(data)
        let num = 0
        let total_ratings = 0
        data.forEach(rate => {
            if (rate.cake_id === cake.id) {
                num += 1
                total_ratings += Number(rate.rating)
            }
        });
        SetNum(num)
        setTotal(total_ratings)
        setAvg(total_ratings/num)
        
    }

    const addRating = async ()=>{
        axios.post('/api/ratings',{
            id: Date.now(),
            cake_id: cake.id,
            rating: rate
        }).then(res=>{
            toast({
                title: "Rating added!"
            })
        })
        setRate(0)
        getRating()
    }

    const addToWishlist = async () =>{
        axios.post('/api/wishlist', {
            item_id: Date.now(),
            user_id: user.id,
            ...cake
        }).then(res=>{
            toast({
                title: "Cake added to wishlist!"
            })
        })
    }

    return (
        <div className='flex flex-col gap-8 text-white w-[600px]'>
            <h2 className='flex flex-col gap-1'>
                <span className='text-primary font-bold text-2xl'>{cake.name} </span>
                <span className='font-extralight text-xl'>
                    {cake.description}
                </span>
            </h2>

            {/* ratings */}
            <div className='flex gap-4 items-center'>
                <div className='h-4 bg-secondary-foreground rounded-full w-[50%]'>
                    <div
                        className='h-4 rounded-full bg-primary'
                        style={{ width: `${(avg_rating / 10) * 100}%` }}
                    ></div>
                </div>
                <h2>average rating: {avg_rating.toFixed(1)}</h2>
                <div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <h2 className='text-xl cursor-pointer'>+</h2>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Add a rating out of 10</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Input type="number" onChange={(e)=>setRate(e.target.value)} value={rate}/>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={()=>addRating()}>Add</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <h2 className='font-extralight text-2xl' >
                ${quan > 0 ? subtotal : price}
            </h2>
            <div className='flex gap-4 items-center justify-start'>
                <Button onClick={() => { setPrice(cake.small); setSize('small') }} className={`${size === "small" ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Small: 6"</Button>
                <Button onClick={() => { setPrice(cake.medium); setSize('med') }} className={`${size === "med" ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Med: 9"</Button>
                <Button onClick={() => { setPrice(cake.large); setSize('large') }} className={`${size === "large" ? 'bg-primary outline-none' : "bg-transparent outline outline-secondary-foreground"}`}>Large: 12"</Button>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className={`${quan > 0 ? 'bg-primary outline-none' : 'bg-transparent outline outline-secondary-foreground'}`}>{quan}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Quantity</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={quan} onValueChange={setQuan}>
                            <DropdownMenuRadioItem value={0}>0</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={1}>1</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={2}>2</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={3}>3</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={4}>4</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value={5}>5</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Textarea placeHolder="Add extra details here" value={extra} onChange={(e) => setExtra(e.target.value)} />

            <div className='flex gap-4 items-center'>
                <Button disabled={!(size) && quan<1} onClick={()=>addToCart()}>Add to Cart</Button>
                <HeartIcon className='cursor-pointer' onClick={()=>addToWishlist()}/>
            </div>

        </div>
    )
}

export default Details

