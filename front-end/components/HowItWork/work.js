import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, UserPlus, LightbulbIcon, Banknote, Users, X } from 'lucide-react';

const HowItWorks = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const demoCredentials = {
        email: "demo@bharatbazaar.com",
        password: "bazaar@2024"
    };

    const steps = [
        {
            icon: <UserPlus className="w-12 h-12 text-[#4DEF7C]" />,
            title: "Create Your Account",
            description: "Sign up and join our community of entrepreneurs and investors. Complete your profile to showcase your expertise or investment interests.",
            link: "/signup",
            linkText: "Create Account"
        },
        {
            icon: <Banknote className="w-12 h-12 text-[#4DEF7C]" />,
            title: "Connect with Investors",
            description: "Investors can browse ideas, access AI-generated analysis reports, and connect with entrepreneurs. Set your investment preferences and get matched with relevant opportunities.",
            link: "/invest",
            linkText: "Explore Opportunities"
        },
        {
            icon: <LightbulbIcon className="w-12 h-12 text-[#4DEF7C]" />,
            title: "Share Your Vision",
            description: "Have a business idea? Post it on our platform with detailed strategy, financials, and market analysis. Let investors discover your potential.",
            link: "/fund",
            linkText: "Post Your Idea"
        },
        {
            icon: <Users className="w-12 h-12 text-[#4DEF7C]" />,
            title: "Engage with Community",
            description: "Join discussions, ask questions, and share your expertise. Our community helps each other grow through knowledge sharing and mentorship.",
            link: "/ask-for-help",
            linkText: "Join Discussion"
        }
    ];

    return (
        <div id="work" className="w-full py-16 px-4 md:px-28 bg-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold text-[#162022] mb-4">
                    How It Works
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                    Bharat Bazar makes it simple to connect entrepreneurs with investors and build a supportive business community.
                </p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#4DEF7C] hover:bg-[#3dd669] text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                    Try Demo Version
                </button>
            </div>

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-[#162022]">Demo Credentials</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="text"
                                    value={demoCredentials.email}
                                    readOnly
                                    className="w-full p-2 border rounded bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="text"
                                    value={demoCredentials.password}
                                    readOnly
                                    className="w-full p-2 border rounded bg-white"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            Use these credentials to explore our platform&apos;s features in demo mode.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div className="mb-4">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-[#162022] mb-3">
                            {step.title}
                        </h3>
                        <p className="text-gray-600 text-center mb-4">
                            {step.description}
                        </p>
                        <Link
                            href={step.link}
                            className="flex items-center text-[#4DEF7C] hover:text-[#3dd669] transition-colors font-medium"
                        >
                            {step.linkText}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;