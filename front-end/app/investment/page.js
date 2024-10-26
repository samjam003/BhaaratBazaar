'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FaTrash, FaHandshake } from 'react-icons/fa';
import { getSession } from 'next-auth/react';

const InvestmentPage = () => {
    const [investments, setInvestments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false); // State for the add investment form
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [userId, setUserId] = useState('20090c90-a672-4996-9c67-0899fe97dda1')
    const [location, setLocation] = useState('')
    const [error, setError] = useState('')
    
    // State for the investment form
    const [idea, setIdea] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [strategy, setStrategy] = useState('');
    const [sessions, setSession] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = await getSession();
                setSession(session)
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

    // Fetch investments
    const fetchInvestments = async () => {
        
        const { data, error } = await supabase.from('getinvestment').select('id, idea, description, amount, strategy,user_id');
        if (error) console.error('Error fetching investments:', error);
        else setInvestments(data);
    };

    // Add new investment
    const handleAddInvestment = async (event) => {
        event.preventDefault();
        const userId=(sessions.user.id)
        
        const { error } = await supabase.from('getinvestment').insert([
            { idea, description, amount: parseFloat(amount), strategy, user_id:userId,location }
        ]);

        if (error) {
            console.error('Error adding investment:', error);
        } else {
            fetchInvestments(); // Refresh investments
            resetForm(); // Reset the form fields
            setShowFormModal(false); // Close the form modal
        }
    };

    // Delete investment
    const handleDelete = async (id) => {
        const { error } = await supabase.from('getinvestment').delete().eq('id', id);
        if (error) console.error('Error deleting investment:', error);
        else fetchInvestments(); // Refresh after delete
    };

    // Handle "Approach" button click
    const handleApproach = (investment) => {
        console.log(sessions.user.id)
        setSelectedInvestment(investment);
        setShowModal(true);
    };

    // Reset form fields
    const resetForm = () => {
        setIdea('');
        setDescription('');
        setAmount('');
        setStrategy('');
    };

    return (
        <div className="p-5">
            {/* Button to add a new investment */}
            <button 
                onClick={() => setShowFormModal(true)} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md mb-5">
                Add Investment
            </button>

            {/* Display Investment Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {investments.map((investment) => (
                    <div key={investment.id} className="p-4 border rounded shadow-sm">
                        <h2 className="text-lg font-semibold">{investment.idea}</h2>
                        <p className="text-sm">{investment.description}</p>
                        <p className="text-sm font-medium">Amount: ${investment.amount}</p>

                        {/* Buttons for Delete and Approach */}
                        <div className="flex gap-4 mt-3">
                        {sessions && sessions.user && sessions.user.id == investment.user_id && (
    <button
        onClick={() => handleDelete(investment.id)}
        className="text-red-600 hover:text-red-800"
        aria-label="Delete Investment"
    >
        <FaTrash />
    </button>
)}

                            <button
                                onClick={() => handleApproach(investment)}
                                className="text-blue-600 hover:text-blue-800"
                                aria-label="Approach Investment"
                            >
                                <FaHandshake />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Approach Investment Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold">Approach Investment</h2>
                        {selectedInvestment ? (
                            <>
                                <p><strong>Idea:</strong> {selectedInvestment.idea}</p>
                                <p><strong>Description:</strong> {selectedInvestment.description}</p>
                                <p><strong>Amount:</strong> ${selectedInvestment.amount}</p>
                                <p><strong>Strategy:</strong> {selectedInvestment.strategy}</p>
                            </>
                        ) : (
                            <p>Fill out details to approach an investment</p>
                        )}
                        <button 
                            onClick={() => setShowModal(false)} 
                            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Add Investment Modal */}
            {showFormModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-1/3">
                        <h2 className="text-xl font-semibold">Add Investment</h2>
                        <form onSubmit={handleAddInvestment} className="space-y-4">
                            <div>
                                <label htmlFor="idea" className="block text-sm font-medium text-gray-700">Idea</label>
                                <input
                                    type="text"
                                    id="idea"
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
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
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
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
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
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
                                    Add Investment
                                </button>
                            </div>
                        </form>
                        <button 
                            onClick={() => setShowFormModal(false)} 
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
