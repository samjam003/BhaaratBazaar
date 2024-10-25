'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

function Sidebar() {
    const pathname = usePathname();
    
    // Helper function to check if a link is active
    const isActive = (path) => pathname.pathname === path;

    return (
        <div className='w-full h-full border-r p-6 flex flex-col gap-6'>
            <div className={`p-2 text-base flex items-center gap-2 ${isActive('/') ? 'bg-gray-200' : 'font-medium border rounded-2xl'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                <Link href='/'><div className={isActive('/') ? 'text-blue-600 font-semibold' : ''}>Home</div></Link>
            </div>
            <div className={`p-2 text-base flex items-center gap-2 ${isActive('/investments') ? 'bg-gray-200' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>
                <Link href='/investments'><div className={isActive('/investments') ? 'text-blue-600 font-semibold' : ''}>Investments</div></Link>
            </div>
            <div className={`p-2 text-base flex items-center gap-2 ${isActive('/funds') ? 'bg-gray-200' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-piggy-bank"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" /><path d="M2 9v1c0 1.1.9 2 2 2h1" /><path d="M16 11h.01" /></svg>
                <Link href='/funds'><div className={isActive('/funds') ? 'text-blue-600 font-semibold' : ''}>Funds</div></Link>
            </div>

            {/* Spacer div to push buttons to the bottom */}
            <div className='mt-auto flex flex-col gap-2'>
                <Link href='/signup'>
                    <div className={`bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 ${isActive('/signup') ? 'bg-blue-600' : ''}`}>
                        Signup
                    </div>
                </Link>
                <Link href='/signin'>
                    <div className={`bg-gray-500 text-white text-center py-2 rounded hover:bg-gray-600 ${isActive('/signin') ? 'bg-gray-600' : ''}`}>
                        Signin
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
