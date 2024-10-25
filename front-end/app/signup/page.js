'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Image from 'next/image';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleId, setRoleId] = useState('25fb8cb2-5ca0-462c-8418-35428f5924c7'); // Set this as needed, or fetch from roles table
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [privacyChecked, setPrivacyChecked] = useState(false); // State to track privacy policy checkbox
    const router = useRouter(); // Initialize useRouter

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check if the email is already registered
        const { data: existingUsers, error: fetchError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email);

        if (fetchError) {
            setError(`Error checking email availability: ${fetchError.message}`);
            return;
        }

        if (existingUsers.length > 0) {
            setError('This email is already registered.');
            return;
        }

        const otp = generateOTP();
        const otpExpiry = new Date(new Date().getTime() + 10 * 60000); // OTP valid for 10 minutes

        // Insert user with OTP and default 'unverified' status
        const { error: userInsertError } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    role_id: roleId,
                    password,
                    otp,
                    otp_expiry: otpExpiry,
                    verification_status: 'verified'
                }
            ]);

        if (userInsertError) {
            setError(userInsertError.message);
            return;
        }

        // Prepare the data for the PHP script
        const otpData = {
            email: email,
            otp: otp.toString()
        };

        try {
            // Make a POST request to your PHP script
            const response = await fetch('https://sigce-connect.thesamjam.xyz/otp.php', {
                method: 'POST',


                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(otpData),
            });

            const result = await response.json();

            if (result.status === 'success') {
                setSuccess('OTP sent successfully!');
                //console.log("OTP:", otp);
                const encryptedEmail = encodeURIComponent(btoa(email)); // Encrypt email using base64 encoding

                setTimeout(() => {
                    router.push(`/signup/auth/${encryptedEmail}`);
                }, 2000);
            } else {
                setError('Failed to send OTP. Please try again.');
            }

        } catch (error) {

            cons
            console.error('Error sending OTP:', error);
            setError('An error occurred while sending OTP.');
        }
    };


    const handleBack = () => {
        router.back(); // Use router.back() for navigation
    };

    return (
        <div className='w-full h-[100vh] flex justify-center'>
            {/* <div className='w-1/2'>
                <Image
                    src="/bg-signup.png"
                    width={1000}
                    height={1000}
                    alt="signup"
                    className='w-full h-full object-cover'
                />
            </div> */}
            <div className='md:w-1/2 w-full flex flex-col justify-start md:mt-10'>
                <div className='w-full flex items-center gap-4 md:mt-10 mb-6 p-4 md:border-none md:p-0 border-b'>
                    <button onClick={handleBack} className='text-black hover:text-gray-700 border rounded-full w-10 h-10 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className='md:text-3xl text-xl font-semibold'>Sign up</h1>
                </div>
                {error && <div className="bg-red-200 text-red-700 p-4 mb-4">{error}</div>}
                {success && <div className="bg-green-200 text-green-700 p-4 mb-4">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4 md:px-10 py-10 px-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>
                    <div>
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
                    <div>
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
                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>
                    <div className="flex items-start py-4">
                        <input
                            type="checkbox"
                            id="privacy_policy"
                            checked={privacyChecked}
                            onChange={() => setPrivacyChecked(!privacyChecked)}
                            className="h-4 w-4 text-[#e1ff01] border-gray-300 rounded"
                        />
                        <label htmlFor="privacy_policy" className="ml-2 block text-sm text-gray-900">
                            I agree to the{' '}
                            <a href="/privacy-policy" target="_blank" className="underline text-blue-600">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    <div className='w-full'>
                        <button
                            type="submit"
                            disabled={!privacyChecked} // Disable button unless checkbox is checked
                            className={`inline-flex w-fit justify-center py-3 px-10 border border-transparent rounded-md shadow-sm text-base font-semibold text-black ${privacyChecked ? 'bg-[#298dff] text-white  hover:bg-[#d0e339]' : 'bg-gray-200 cursor-not-allowed'}`}
                        >
                            Sign Up & Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
