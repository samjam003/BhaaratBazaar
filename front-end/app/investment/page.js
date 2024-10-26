'use client'
<<<<<<< HEAD

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from 'next-auth/react';
import { FaTrash, FaHandshake, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { Card } from '@/components/Card';

// Modal Component
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <IoClose size={24} />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </div>
);

// Form Input Component
const FormInput = ({ label, id, type = "text", value, onChange, required = false }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-300">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        rows="3"
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 
          text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 
          focus:border-transparent"
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 
          text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 
          focus:border-transparent"
      />
    )}
  </div>
);

// Investment Card Component
const InvestmentCard = ({ investment, onDelete, onApproach, isOwner }) => (
  <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">{investment.idea}</h2>
          <div className="flex items-center text-slate-400 text-sm">
            <FaMapMarkerAlt className="mr-1" />
            <span>{investment.location}</span>
          </div>
        </div>
        <span className="text-emerald-400 font-medium text-lg">
          ${investment.amount.toLocaleString()}
        </span>
      </div>
      
      <p className="text-slate-300 mb-6">{investment.description}</p>
      
      <div className="border-t border-slate-700 pt-4">
        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm">
            <span className="text-slate-300 font-medium">Strategy: </span>
            {investment.strategy}
          </p>
          <div className="flex gap-3">
            {isOwner && (
              <button
                onClick={() => onDelete(investment.id)}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                aria-label="Delete Investment"
              >
                <FaTrash size={18} />
              </button>
            )}
            <button
              onClick={() => onApproach(investment)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 
                hover:bg-emerald-600 text-white rounded-lg transition-all duration-200 
                font-medium transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaHandshake />
              <span>Approach</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const InvestmentPage = () => {
  const [investments, setInvestments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);
  
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
        const sessionData = await getSession();
        setSession(sessionData);
        if (!sessionData) {
          setError('User not authenticated');
          return;
=======
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
>>>>>>> e87504dddbd2c6ec96c1dfd0fc90199f2a933632
        }
        await fetchInvestments();
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError(error.message);
      }
    };

<<<<<<< HEAD
    fetchData();
  }, []);

  const fetchInvestments = async () => {
    const { data, error } = await supabase
      .from('getinvestment')
      .select('*')
     
      
    if (error) {
      console.error('Error fetching investments:', error);
      setError(error.message);
    } else {
      setInvestments(data);
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('getinvestment').insert([
        {
          ...formData,
          amount: parseFloat(formData.amount),
          user_id: session.user.id
        }
      ]);

      if (error) throw error;

      await fetchInvestments();
      setFormData({
        idea: '',
        description: '',
        amount: '',
        strategy: '',
        location: ''
      });
      setShowFormModal(false);
    } catch (error) {
      console.error('Error adding investment:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('getinvestment')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Investment Opportunities</h1>
            <p className="text-slate-400">Connect with potential investors and grow your business</p>
          </div>
          
          <button 
            onClick={() => setShowFormModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 
              text-white rounded-lg font-semibold transition-all duration-200 
              transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaPlus />
            <span>Add Investment</span>
          </button>
=======
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
>>>>>>> e87504dddbd2c6ec96c1dfd0fc90199f2a933632
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {investments.map((investment) => (
            <InvestmentCard
              key={investment.id}
              investment={investment}
              onDelete={handleDelete}
              onApproach={(inv) => {
                setSelectedInvestment(inv);
                setShowModal(true);
              }}
              isOwner={session?.user?.id === investment.user_id}
            />
          ))}
        </div>

        {/* Approach Modal */}
        {showModal && (
          <Modal
            title="Approach Investment"
            onClose={() => {
              setShowModal(false);
              setSelectedInvestment(null);
            }}
          >
            <div className="space-y-4 text-slate-300">
              <div>
                <span className="text-sm text-slate-400">Investment Idea</span>
                <p className="text-lg font-medium">{selectedInvestment.idea}</p>
              </div>
              <div>
                <span className="text-sm text-slate-400">Description</span>
                <p>{selectedInvestment.description}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-slate-400">Amount</span>
                  <p className="text-lg font-medium text-emerald-400">
                    ${selectedInvestment.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-400">Location</span>
                  <p>{selectedInvestment.location}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Strategy</span>
                <p>{selectedInvestment.strategy}</p>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 
                    text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                    text-white rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Investment Modal */}
        {showFormModal && (
          <Modal
            title="Add Investment"
            onClose={() => setShowFormModal(false)}
          >
            <form onSubmit={handleAddInvestment} className="space-y-6">
              <FormInput
                label="Investment Idea"
                id="idea"
                value={formData.idea}
                onChange={handleFormChange}
                required
              />
              
              <FormInput
                label="Description"
                id="description"
                type="textarea"
                value={formData.description}
                onChange={handleFormChange}
                required
              />
              
              <FormInput
                label="Amount (USD)"
                id="amount"
                type="number"
                value={formData.amount}
                onChange={handleFormChange}
                required
              />
              
              <FormInput
                label="Location"
                id="location"
                value={formData.location}
                onChange={handleFormChange}
                required
              />
              
              <FormInput
                label="Investment Strategy"
                id="strategy"
                type="textarea"
                value={formData.strategy}
                onChange={handleFormChange}
                required
              />
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 
                    text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                    text-white rounded-lg transition-colors"
                >
                  Add Investment
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default InvestmentPage;