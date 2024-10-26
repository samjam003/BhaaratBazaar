'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from 'next-auth/react';
import { Trash2, Handshake, Plus, MapPin, Wallet, Lightbulb, BarChart2 } from 'lucide-react';


const InvestmentPage = () => {
    const [investments, setInvestments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [sessions, setSession] = useState(null);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        idea: '',
        description: '',
        amount: '',
        strategy: '',
        location: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getSession();
                setSession(session);
                if (!session) {
                    setError('User not authenticated');
                    return;
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
                setError(error.message);
            }
        };

        fetchInvestments();
        fetchData();
    }, []);

    const fetchInvestments = async () => {
        const { data, error } = await supabase
            .from('getinvestment')
            .select('id, idea, description, amount, strategy, location, user_id');
        if (error) console.error('Error fetching investments:', error);
        else setInvestments(data);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddInvestment = async (event) => {
        event.preventDefault();
        const userId = sessions?.user?.id;

        const { error } = await supabase.from('getinvestment').insert([{
            ...formData,
            amount: parseFloat(formData.amount),
            user_id: userId
        }]);

        if (error) {
            console.error('Error adding investment:', error);
        } else {
            fetchInvestments();
            setFormData({
                idea: '',
                description: '',
                amount: '',
                strategy: '',
                location: ''
            });
            setShowFormModal(false);
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('getinvestment').delete().eq('id', id);
        if (error) console.error('Error deleting investment:', error);
        else fetchInvestments();
    };

    const handleApproach = (investment) => {
        setSelectedInvestment(investment);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Investment Opportunities</h1>
                        <p className="text-gray-500 mt-2">Discover and manage investment opportunities</p>
                    </div>
                    <button 
                        onClick={() => setShowFormModal(true)}
                        className="flex items-center px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Investment
                    </button>
                </div>

                {/* Investment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investments.map((investment) => (
                        <div key={investment.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                            <div className="flex items-center mb-4">
                                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                                <h3 className="text-lg font-semibold">{investment.idea}</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-gray-600 line-clamp-2">{investment.description}</p>
                                
                                <div className="flex items-center text-gray-600">
                                    {/* <Banknotes className="w-4 h-4 mr-2" /> */}
                                    <span className="font-semibold">${investment.amount.toLocaleString()}</span>
                                </div>
                                
                                {investment.location && (
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{investment.location}</span>
                                    </div>
                                )}
                                
                                {investment.strategy && (
                                    <div className="flex items-center text-gray-600">
                                        <BarChart2 className="w-4 h-4 mr-2" />
                                        <span className="line-clamp-1">{investment.strategy}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4">
                                    <button
                                        onClick={() => handleApproach(investment)}
                                        className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    >
                                        {/* <HandshakeMinus className="w-4 h-4 mr-2" /> */}
                                        Approach
                                    </button>
                                    
                                    {sessions?.user?.id === investment.user_id && (
                                        <button
                                            onClick={() => handleDelete(investment.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Investment Modal */}
                {showFormModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Add New Investment</h2>
                                <button 
                                    onClick={() => setShowFormModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddInvestment} className="space-y-4">
                                <div>
                                    <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-1">
                                        Investment Idea
                                    </label>
                                    <input
                                        id="idea"
                                        type="text"
                                        value={formData.idea}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your investment idea"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe your investment opportunity"
                                        rows={3}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter investment amount"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter investment location"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="strategy" className="block text-sm font-medium text-gray-700 mb-1">
                                        Strategy
                                    </label>
                                    <input
                                        id="strategy"
                                        type="text"
                                        value={formData.strategy}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter investment strategy"
                                        required
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowFormModal(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Add Investment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Investment Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Investment Details</h2>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            {selectedInvestment && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold flex items-center">
                                            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                                            {selectedInvestment.idea}
                                        </h3>
                                        <p className="mt-2 text-gray-600">{selectedInvestment.description}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">Amount</label>
                                            <p className="font-semibold">${selectedInvestment.amount.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Location</label>
                                            <p className="font-semibold">{selectedInvestment.location}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-500">Strategy</label>
                                        <p className="font-semibold">{selectedInvestment.strategy}</p>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentPage;