'use client'
import React, { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const session = await getSession();

                if (!session) {
                    setError('Not authenticated');
                    return;
                }

                const { data, error: supabaseError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', session.user.email)
                    .single();

                if (supabaseError) {
                    throw new Error(supabaseError.message);
                }

                if (data) {
                    setUserData(data);
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
            {userData ? (
                <div>
                    <p>Welcome, {userData.email}</p>
                    <p>Welcome, {userData.name}</p>
                    <p>Welcome, {userData.phone_number}</p>
                    <p>Welcome, {userData.address}</p>
                    <p>Welcome, {userData.gender}</p>
                    {/* Add more user data fields as needed */}
                </div>
            ) : (
                <p>No user data found</p>
            )}
        </div>
    );
};

export default ProfilePage;