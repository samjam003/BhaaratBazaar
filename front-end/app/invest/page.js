'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FaTrash, FaHandshake, FaEye } from 'react-icons/fa';

const InvestmentPage = () => {
    const [investments, setInvestments] = useState([]);
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [strategy, setStrategy] = useState('');

    const loggedInUserId = "20090c90-a672-4996-9c67-0899fe97dda1"; // Replace this with the actual logged-in user ID

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        const { data, error } = await supabase.from('investments').select('*');
        if (error) {
            console.error('Error fetching investments:', error);
        } else {
            console.log('Fetched Investments:', data); // Log fetched data for debugging
            setInvestments(data);
        }
    };

    const handleAddInvestment = async (event) => {
        event.preventDefault();
        const { error } = await supabase.from('investments').insert([
            {
                idea: `Investment Idea ${investments.length + 1}`, // Example idea
                description: `Description for investment ${investments.length + 1}`, // Example description
                amount: parseFloat(amount),
                strategy: "Default Strategy", // Example strategy
                user_id: loggedInUserId,
            },
        ]);

        if (error) console.error('Error adding investment:', error);
        else {
            fetchInvestments(); // Refresh investments
            setShowInvestmentModal(false); // Close modal
            setAmount(''); // Reset input
        }
    };

    const handleAddInvestmentRequest = async (event) => {
        event.preventDefault();

        const { error } = await supabase.from('investment_requests').insert([
            { 
                investment_id: selectedInvestment.id,
                user_id: loggedInUserId,
                name,
                description,
                amount: parseFloat(amount),
                strategy,
            }
        ]);

        if (error) console.error('Error adding investment request:', error);
        else {
            fetchInvestments(); // Refresh investments
            resetRequestForm(); // Reset the request form fields
            setShowRequestModal(false); // Close the request modal
        }
    };

    const resetRequestForm = () => {
        setName('');
        setDescription('');
        setAmount('');
        setStrategy('');
    };

    const handleViewRequests = async (investmentId) => {
        const { data, error } = await supabase
            .from('investment_requests')
            .select('*')
            .eq('investment_id', investmentId);

        if (error) console.error('Error fetching requests:', error);
        else {
            console.log('Incoming Requests:', data);
            // Implement logic to show these requests in a modal or log them
        }
    };

    return (
        <div className="p-5">
            {/* Button to add a new investment */}
            <button 
                onClick={() => setShowInvestmentModal(true)} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md mb-5">
                Add Investment
            </button>

            {/* Display Investment Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {investments.length > 0 ? (
                    investments.map((investment) => (
                        <div key={investment.id} className="p-4 border rounded shadow-sm">
                            <h2 className="text-lg font-semibold">{investment.idea}</h2>
                            <p className="text-sm">{investment.description}</p>
                            <p className="text-sm font-medium">Amount: ${investment.amount}</p>

                            {/* Buttons for Approach and View Requests */}
                            <div className="flex gap-4 mt-3">
                                <button
                                    onClick={() => {
                                        setSelectedInvestment(investment);
                                        setShowRequestModal(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                    aria-label="Approach Investment"
                                >
                                    <FaHandshake />
                                </button>
                                <button
                                    onClick={() => handleViewRequests(investment.id)}
                                    className="text-green-600 hover:text-green-800"
                                    aria-label="View Requests"
                                >
                                    <FaEye />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No investments found.</p>
                )}
            </div>

            {/* Add Investment Modal */}
            {showInvestmentModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold">Add Investment</h2>
                        <form onSubmit={handleAddInvestment} className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Investment Amount</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                    Add Investment
                                </button>
                            </div>
                        </form>
                        <button 
                            onClick={() => setShowInvestmentModal(false)} 
                            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Investment Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold">Investment Request</h2>
                        <form onSubmit={handleAddInvestmentRequest} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
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
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Requested Amount</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="strategy" className="block text-sm font-medium text-gray-700">Strategy</label>
                                <input
                                    type="text"
                                    id="strategy"
                                    value={strategy}
                                    onChange={(e) => setStrategy(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md">
                                    Submit Request
                                </button>
                            </div>
                        </form>
                        <button 
                            onClick={() => setShowRequestModal(false)} 
                            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentPage;
