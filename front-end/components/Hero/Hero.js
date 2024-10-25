import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Hero() {
    return (
        <div className='w-full mt-24'>
            <div className='w-full md:px-28  bg-[#162022]'>
                <div className='text-xl w-full flex items-center py-10'>
                    {/* <div className='text-7xl font-semi-bold text-white gap-0.5 flex'>
                        <span className=''>Bharat</span>
                        <span className=''>Bazar</span>
                    </div> */}
                    <div className='w-1/2'>
                        <div className='text-5xl font-semibold w-full text-white leading-tight'>
                            The
                            platform where
                            aspirations turn
                            into reality!
                        </div>
                        <div className='text-base text-gray-200 mt-4'>
                            Esigned to connect people across India, Bharat Bazar enables users to share financial and entrepreneurial goals, seek advice, and collaborate with mentors and peers
                        </div>
                        <div className='flex items-center gap-2'>
                            <Link href='' className='bg-[#4DEF7C] py-2 px-4 rounded-sm text-[#162022] font-medium text-base mt-8'>Get Started</Link>
                            <Link href='' className=' py-2 px-4 rounded-sm text-white font-medium text-base mt-8'>Discover More</Link>
                        </div>
                    </div>

                    <div className='w-1/2 flex justify-center items-center'>
                        <Image
                            src="/App.svg"
                            width={500}
                            height={500}
                            alt="Picture of the author"
                            className='w-full h-[400px]'
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Hero