import Link from 'next/link'
import React from 'react'

function Topbar() {
    return (
        <div className='w-full flex items-center justify-between bg-[#162022] md:px-28 py-8'>
            <div className='text-white font-medium text-lg'>
                BHARAT BAZAR
            </div>
            <div className='text-white flex items-center gap-16 '>
                <Link href='/'>Home</Link>
                <Link href='/investment'>Investments</Link>
                <Link href='/ask-for-help'>Explore</Link>
                <Link href=''>Funds</Link>
            </div>
            <div className='text-white flex items-center gap-8'>
                <Link href=''>Sign Up</Link>
                <Link href='' className='bg-[#4DEF7C] py-2 px-4 rounded-sm text-[#162022] font-medium'>Sign In</Link>
            </div>
        </div>
    )
}

export default Topbar