'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';

function Topbar() {
    const [isSignin, setIsSignin] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // For dropdown visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getSession();
                if (session) {
                    setIsSignin(true);
                } else {
                    setIsSignin(false);
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
            }
        };
        fetchData();
    }, []);

    const toggleDropdown = () => setShowDropdown(prev => !prev);
    
    return (
        <div className='w-full flex items-center justify-between bg-[#162022] md:px-28 py-8'>
            <div className='text-white font-medium text-lg'>
                BHARAT BAZAR
            </div>
            <div className='text-white flex items-center gap-16 '>
                <Link href='/'>Home</Link>
                <Link href='/investment'>Investments</Link>
                <Link href='/ask-for-help'>Explore</Link>
                <Link href='/invest'>Funds</Link>
            </div>
            <div className='text-white flex items-center gap-8'>
                {!isSignin ? (
                    <>
                        <Link href='/signup'>Sign Up</Link>
                        <Link href='/signin' className='bg-[#4DEF7C] py-2 px-4 rounded-sm text-[#162022] font-medium'>Sign In</Link>
                    </>
                ) : (
                    <div className='relative'>
                        <button onClick={toggleDropdown} className='flex items-center gap-2'>
                            <img src='/profile-icon.png' alt='Profile' className='w-8 h-8 rounded-full' /> {/* Placeholder for profile icon */}
                            <span>Profile</span>
                        </button>
                        {showDropdown && (
                            <div className='absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg'>
                                <Link href='/profile' className='block px-4 py-2 hover:bg-gray-100'>View Profile</Link>
                                <button onClick={() => signOut()} className='w-full text-left px-4 py-2 hover:bg-gray-100'>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Topbar;
