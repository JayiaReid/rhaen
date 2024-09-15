// "use client"
import { Heart, ListFilter, SearchIcon, ShoppingBasket, User2Icon } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

const Nav = () => {
    return (
        <div className='p-5 bg-black flex justify-between items-center max-w-[100%]'>
            <Link href={'/'}><h2 className='text-4xl text-primary'>Rhæn</h2></Link>
            <div className='flex text-primary items-center justify-around'>
                <Link href={'/'} className='p-1'>
                    <SearchIcon strokeWidth={0.75} size={30}/>
                </Link>
                <Link href={'/wishlist'} className='p-1'>
                    <Heart strokeWidth={0.75} size={30} />
                </Link>
                <Link href={'/account'} className='p-1'>
                    <User2Icon strokeWidth={0.75} size={30}  />
                </Link>
                <Link href={'/cart'} className='p-1'>
                    <ShoppingBasket strokeWidth={0.75} size={30} />
                </Link>
                {/* <ListFilter strokeWidth={0.75} onClick={()=>setShowCat(!showCat)}/> */}
            </div>

        </div>
    )
}

export default Nav