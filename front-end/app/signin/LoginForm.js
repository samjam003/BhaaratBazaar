'use client'
import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2';

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password_hash:password
        });

        if (result.error) {
            setError(result.error); // Display the error message
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.error,
            });
        } else {
            const session = await getSession();
            if (session) {
                Swal.fire({
                    icon: 'success',
                    title: 'Logged in!',
                    text: 'Welcome back!',
                });
                // Store user info in the session and redirect based on role
                router.push('/'); // Adjust the redirect based on your app's structure
            }
        }
    }

    const handleBack = () => {
        router.back(); // Go back to the previous page
    };

    return (
        <div className='w-full h-[100vh] flex justify-center'>
            <div className='md:w-1/2 w-full flex flex-col justify-start md:mt-10'>
                <div className='w-full flex items-center gap-4 md:mt-10 mb-6 p-4 md:border-none md:p-0 border-b'>
                    <button onClick={handleBack} className='text-black hover:text-gray-700 border rounded-full w-10 h-10 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className='md:text-3xl text-xl font-semibold'>Sign In</h1>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-4 md:px-10 py-10 px-5">
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>
                    <div className='w-full'>
                        <button
                            type="submit"
                            className={`inline-flex w-fit justify-center py-3 px-10 border border-transparent rounded-md shadow-sm text-base font-semibold text-black bg-[#298dff] text-white  hover:bg-[#d0e339]`}
                        >
                            Sign In
                        </button>
                    </div>
                    <div className="mt-6 text-center w-full">
                        <p className="text-sm text-gray-600  w-full flex justify-center items-center gap-1.5">
                            Don’t have an account?
                            <Link href="/signup" className='text-blue-500'>
                                Register here
                            </Link>
                        </p>
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    )
}

export default SignIn;
