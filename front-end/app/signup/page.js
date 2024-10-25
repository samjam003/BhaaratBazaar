'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); // Set this as needed, or fetch from roles table
    const [address, setAddress] = useState(''); 
    const [phone, setPhone] = useState(''); 
    const [gender, setGender] = useState(''); 
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [privacyChecked, setPrivacyChecked] = useState(false); // State to track privacy policy checkbox
    const router = useRouter(); // Initialize useRouter

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

        // Insert user with default 'unverified' status
        const { error: userInsertError } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    role: role,
                    password_hash:password,
                    phone_number: phone,
                    address,
                    gender,
                }
            ]);

        if (userInsertError) {
            setError(userInsertError.message);
            return;
        }

        setSuccess('Registration successful!');
        // Optional: Redirect after successful registration
    };

    const handleBack = () => {
        router.back(); // Use router.back() for navigation
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
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile No.</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
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
                            className={`inline-flex w-fit justify-center py-3 px-10 border border-transparent rounded-md shadow-sm text-base font-semibold text-black ${privacyChecked ? 'bg-[#298dff] text-white hover:bg-[#d0e339]' : 'bg-gray-200 cursor-not-allowed'}`}
                        >
                            Sign Up & Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
