"use client"
import axios from 'axios'
import { LoaderPinwheelIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const OrderItem = ({ order, curr }) => {
    const [loading, setLoading] = useState(true)
    const [cakeNames, setCakeNames] = useState({})

    const getCakeName = async (id) => {
        try {
            const res = await axios.get('/api/cakes')
            const filtered = res.data.filter(cake => cake.id == id)
            return filtered.length > 0 ? filtered[0].name : 'Unknown Cake'
        } catch (error) {
            console.error('Error fetching cake names:', error)
            return 'Unknown Cake'
        }
    }

    useEffect(() => {
        const fetchCakeNames = async () => {
            const names = {}
            for (let item of order.cart_items) {
                const cakeName = await getCakeName(item.cake_id)
                names[item.cake_id] = cakeName
            }
            setCakeNames(names)
            setLoading(false)
        }

        fetchCakeNames()
    }, [order])

    if (loading) {
        return (
            <div className='h-screen w-screen items-center justify-center flex'>
                <LoaderPinwheelIcon className='text-primary animate-spin' />
            </div>
        )
    }

    return (
        <div className='border rounded-lg m-4 w-[300px] text-white p-4 flex flex-col gap-2'>
            <h2 className='text-primary text-2xl my-2'>Order ID : {order.id}</h2>
            {order.cart_items.map((item, itemKey) => (
                <h2 key={itemKey} className='bg-primary text-white p-2 rounded-md'>
                    {cakeNames[item.cake_id] || 'Loading...'}
                </h2>
            ))}
            <h2>{order.delivery ? 'Delivery' : 'Pick up'}</h2>
            <h2>{order.delivery ? `Address: ${order.address}` : null}</h2>
            <h2>Total: ${order.total_price}</h2>
            <h2>Ordered on {order.created_at}</h2>
            <h2>{order.delivery? 'delivery on ' : 'pick up on '}{order.ready_date}</h2>
            {curr? <h2 className='my-2 outline outline-secondary-foreground'>{order.status}</h2>: null}
        </div>
    )
}

export default OrderItem
