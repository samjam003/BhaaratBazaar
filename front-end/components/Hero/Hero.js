// Hero.jsx
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Hero() {
    return (
        <div className='w-full mt-8 md:mt-24'>
            <div className='w-full px-4 md:px-28 bg-[#162022]'>
                <div className='flex flex-col md:flex-row items-center py-6 md:py-10'>
                    <div className='w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0'>
                        <div className='text-3xl md:text-5xl font-semibold text-white leading-tight'>
                            The platform where aspirations turn into reality!
                        </div>
                        <div className='text-sm md:text-base text-gray-200 mt-4'>
                            Designed to connect people across India, Bharat Bazar enables users to share financial and entrepreneurial goals, seek advice, and collaborate with mentors and peers
                        </div>
                        <div className='flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 mt-6'>
                            <Link href='/#work' className='w-full sm:w-auto bg-[#4DEF7C] py-2 px-4 rounded-sm text-[#162022] font-medium text-base text-center hover:bg-[#3dd669] transition-colors'>Get Started</Link>
                            {/* <Link href='' className='w-full sm:w-auto py-2 px-4 rounded-sm text-white font-medium text-base text-center hover:text-[#4DEF7C] transition-colors'>Discover More</Link> */}
                        </div>
                    </div>

                    <div className='w-full md:w-1/2 flex justify-center items-center'>
                        <Image
                            src="/App.svg"
                            width={500}
                            height={500}
                            alt="Picture of the author"
                            className='w-full max-w-[400px] md:max-w-none h-auto md:h-[400px]'
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
