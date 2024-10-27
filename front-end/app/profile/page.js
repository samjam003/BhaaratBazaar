'use client'
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { FaSpinner, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaPen } from 'react-icons/fa';

// Create Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
        <FaSpinner className="animate-spin text-emerald-500 text-2xl" />
    </div>
);

// Profile Field Component
const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-emerald-400 mt-1">
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <p className="text-white mt-1">{value || 'Not provided'}</p>
        </div>
    </div>
);

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 p-6">
                <div className="max-w-3xl mx-auto">
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-red-400">Error: {error}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
                    <p className="text-slate-400">Manage your personal information</p>
                </div>

                {userData ? (
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-2xl text-white">Personal Information</CardTitle>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                                <FaPen size={18} />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <ProfileField
                                    icon={FaUser}
                                    label="Full Name"
                                    value={userData.name}
                                />
                                <ProfileField
                                    icon={FaEnvelope}
                                    label="Email"
                                    value={userData.email}
                                />
                                <ProfileField
                                    icon={FaPhone}
                                    label="Phone Number"
                                    value={userData.phone_number}
                                />
                                <ProfileField
                                    icon={FaVenusMars}
                                    label="Gender"
                                    value={userData.gender}
                                />
                                <div className="md:col-span-2">
                                    <ProfileField
                                        icon={FaMapMarkerAlt}
                                        label="Address"
                                        value={userData.address}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 pt-6 border-t border-slate-700">
                                    <button
                                        className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors duration-200"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="flex items-center justify-center p-12">
                            <p className="text-slate-400 text-lg">No user data found</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;