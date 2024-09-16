"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { ArrowDown, HeartIcon, LoaderPinwheelIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const CartItem = ({ item, refreshData }) => {
    const [cake, setCake] = useState({})
    const [loading, setLoading] = useState(true)
    const [price, setPrice] = useState(0)
    const [size, setSize] = useState(item.size)
    const [extra, setExtra] = useState(item.extra)
    const [quan, setQuan] = useState(item.quantity)
    const [subtotal, setSubTotal] = useState(item.price)

    useEffect(() => {
        axios.get('api/cakes').then(res => {
            const filtered = res.data.filter(cake => cake.id === item.cake_id)
            console.log(filtered)
            setCake(filtered[0])
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if(price!==0){
            setSubTotal((Number(price) * quan).toFixed(2))
        }
        refreshData()
    }, [price, quan])

    const addToWishlist = async () =>{
        axios.post('/api/wishlist', {
            user_id: item.user_id,
            ...cake
        }).then(res=>console.log(res))
    }

    const deleteItem = async ()=>{
        axios.delete('/api/cart', { data: { id: item.id } }).then(res=>{console.log(res); refreshData()})
    }

    if (loading) return <div className="h-auto w-auto flex items-center justify-center">
        <LoaderPinwheelIcon className="animate-spin text-primary" />
    </div>

    return (
        <div className='flex w-auto border rounded-lg m-5 gap-4 h-[200px]'>
            <Image src={cake.image} width={250} height={200} className='p-4 rounded-lg object-cover' />
            <div className='flex w-full flex-col gap-2 justify-between'>
                <div className='p-3 flex flex-col gap-2'>
                    <h2 className='text-2xl text-primary'>{cake.name}</h2>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='bg-primary outline-none'>size: {size} <ArrowDown size={12}/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Size</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={size} onValueChange={setSize}>
                                    <DropdownMenuRadioItem onClick={() => setPrice(cake.small)} value='small'>Small: 6"</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem onClick={() => setPrice(cake.medium)} value='med'>medium: 9"</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem onClick={() => setPrice(cake.large)} value='large'>large: 12"</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='flex p-3 w-full justify-between items-center text-white'>
                    <h2 className='text-2xl text-white'>${subtotal}</h2>
                    <div className='flex w-full gap-2 p-3 justify-end items-center'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className={`${quan > 0 ? 'bg-primary outline-none' : 'bg-transparent outline outline-secondary-foreground'}`}>quantity: {quan} <ArrowDown size={12}/></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>Quantity</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={quan} onValueChange={setQuan}>
                                        <DropdownMenuRadioItem value={1}>1</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value={2}>2</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value={3}>3</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value={4}>4</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value={5}>5</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <HeartIcon onClick={()=>{addToWishlist();deleteItem();}} className='cursor-pointer p-0.5'/>
                        <TrashIcon onClick={()=>{deleteItem()}} className='cursor-pointer p-0.5'/>
                </div>
            </div>

        </div>
    )
}

export default CartItem