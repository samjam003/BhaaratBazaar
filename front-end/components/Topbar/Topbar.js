'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';

export default function Topbar() {
    const [isSignin, setIsSignin] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getSession();
                setIsSignin(!!session);
            } catch (error) {
                console.error('Error in fetchData:', error);
            }
        };
        fetchData();
    }, []);

    const toggleDropdown = () => setShowDropdown(prev => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    return (
        <div className='w-full flex items-center justify-between bg-[#162022] px-4 md:px-28 py-4 md:py-8 relative'>
            <div className='text-white font-medium text-base md:text-lg'>
                BHARAT BAZAR
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex text-white items-center gap-8 lg:gap-16'>
                <Link href='/' className='hover:text-[#4DEF7C] transition-colors'>Home</Link>
                <Link href='#work' className='hover:text-[#4DEF7C] transition-colors'>How it works?</Link>{isSignin ? (<div className='hidden md:flex text-white items-center gap-8 lg:gap-16'>
                    <Link href='/invest' className='hover:text-[#4DEF7C] transition-colors'>Investments</Link>
                    <Link href='/ask-for-help' className='hover:text-[#4DEF7C] transition-colors'>Explore</Link>
                    <Link href='/fund' className='hover:text-[#4DEF7C] transition-colors'>Get Funds</Link>
                </div>
                ) : null}
            </div>

            {/* Desktop Auth */}
            <div className='hidden md:flex text-white items-center gap-4 md:gap-8'>
                {!isSignin ? (
                    <>
                        <Link href='/signup' className='hover:text-[#4DEF7C] transition-colors'>Sign Up</Link>
                        <Link href='/signin' className='bg-[#4DEF7C] py-2 px-4 rounded-sm text-[#162022] font-medium hover:bg-[#3dd669] transition-colors'>Sign In</Link>
                    </>
                ) : (
                    <div className='relative'>
                        <button onClick={toggleDropdown} className='flex items-center gap-2'>
                            <img src='/images.jfif' alt='Profile' className='w-8 h-8 rounded-full' />
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

            {/* Mobile Menu Button */}
            <button className='md:hidden text-white' onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='absolute top-full left-0 w-full bg-[#162022] border-t border-gray-700 md:hidden'>
                    <div className='flex flex-col p-4'>
                        <Link href='/' className='text-white py-2 hover:text-[#4DEF7C] transition-colors'>Home</Link>
                        <Link href='/invest' className='text-white py-2 hover:text-[#4DEF7C] transition-colors'>Investments</Link>
                        <Link href='/ask-for-help' className='text-white py-2 hover:text-[#4DEF7C] transition-colors'>Explore</Link>
                        <Link href='/fund' className='text-white py-2 hover:text-[#4DEF7C] transition-colors'>Funds</Link>
                        {!isSignin ? (
                            <>
                                <Link href='/signup' className='text-white py-2 hover:text-[#4DEF7C] transition-colors'>Sign Up</Link>
                                <Link href='/signin' className='bg-[#4DEF7C] py-2 px-4 mt-2 rounded-sm text-[#162022] font-medium text-center hover:bg-[#3dd669] transition-colors'>Sign In</Link>
                            </>
                        ) : (
                            <>
                                <Link href='/profile' className='text-white py-2 hover:text-[#4DEF7C] transition-colors'>Profile</Link>
                                <button onClick={() => signOut()} className='text-white py-2 text-left hover:text-[#4DEF7C] transition-colors'>Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}