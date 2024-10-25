'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FaTrash, FaHandshake } from 'react-icons/fa';

const InvestmentPage = () => {
    const [investments, setInvestments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [newInvestment, setNewInvestment] = useState({
        idea: '',
        description: '',
        amount: '',
        strategy: ''
    });

    useEffect(() => {
        fetchInvestments();
    }, []);

    // Fetch investments
    const fetchInvestments = async () => {
        const { data, error } = await supabase.from('GetInvestment').select('id, idea, description, amount, strategy');
        if (error) console.error('Error fetching investments:', error);
        else setInvestments(data);
    };

    // Add new investment
    const handleAddInvestment = async () => {
        const { error } = await supabase.from('GetInvestment').insert(newInvestment);
        if (error) console.error('Error adding investment:', error);
        else {
            fetchInvestments(); // Refresh after add
            setShowModal(false);
            setNewInvestment({ idea: '', description: '', amount: '', strategy: '' });
        }
    };

    // Delete investment
    const handleDelete = async (id) => {
        const { error } = await supabase.from('GetInvestment').delete().eq('id', id);
        if (error) console.error('Error deleting investment:', error);
        else fetchInvestments(); // Refresh after delete
    };

    // Handle "Approach" button click
    const handleApproach = (investment) => {
        setSelectedInvestment(investment);
        setShowModal(true);
    };

    // Handle opening modal for new investment
    const openNewInvestmentModal = () => {
        setSelectedInvestment(null); // Ensure no existing investment is selected
        setShowModal(true);
    };

    return (
        <div className="p-5">
            {/* Button to add a new investment */}
            <button 
                onClick={openNewInvestmentModal} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md mb-5">
                Approach Investment
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
                            <button
                                onClick={() => handleDelete(investment.id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Delete Investment"
                            >
                                <FaTrash />
                            </button>
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

            {/* Modal for Viewing or Adding Investment */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-1/3">
                        {selectedInvestment ? (
                            // Display selected investment details
                            <>
                                <h2 className="text-xl font-semibold">Investment Details</h2>
                                <p><strong>Idea:</strong> {selectedInvestment.idea}</p>
                                <p><strong>Description:</strong> {selectedInvestment.description}</p>
                                <p><strong>Amount:</strong> ${selectedInvestment.amount}</p>
                                <p><strong>Strategy:</strong> {selectedInvestment.strategy}</p>
                            </>
                        ) : (
                            // Form to add new investment
                            <>
                                <h2 className="text-xl font-semibold">Add New Investment</h2>
                                <input 
                                    type="text" 
                                    placeholder="Idea" 
                                    value={newInvestment.idea} 
                                    onChange={(e) => setNewInvestment({ ...newInvestment, idea: e.target.value })}
                                    className="w-full mb-2 p-2 border rounded"
                                />
                                <textarea 
                                    placeholder="Description" 
                                    value={newInvestment.description} 
                                    onChange={(e) => setNewInvestment({ ...newInvestment, description: e.target.value })}
                                    className="w-full mb-2 p-2 border rounded"
                                ></textarea>
                                <input 
                                    type="number" 
                                    placeholder="Amount" 
                                    value={newInvestment.amount} 
                                    onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                                    className="w-full mb-2 p-2 border rounded"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Strategy" 
                                    value={newInvestment.strategy} 
                                    onChange={(e) => setNewInvestment({ ...newInvestment, strategy: e.target.value })}
                                    className="w-full mb-2 p-2 border rounded"
                                />
                                <button 
                                    onClick={handleAddInvestment} 
                                    className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md">
                                    Save Investment
                                </button>
                            </>
                        )}
                        <button 
                            onClick={() => setShowModal(false)} 
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
