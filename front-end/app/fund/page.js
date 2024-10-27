'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from 'next-auth/react';
import { FaTrash, FaHandshake, FaPlus, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { Card } from '@/components/Card';
import Groq from 'groq-sdk';

// Modal Component
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
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
const InvestmentCard = ({ investment, onDelete, onApproach, onAnalysis, isOwner }) => (
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
          &#8377;{investment.amount.toLocaleString()}
        </span>
      </div>

      <p className="text-slate-300 mb-6">{investment.description}</p>

      <div className="border-t border-slate-700 pt-4">
        <div className="flex flex-col justify-between items-center">
          <p className="text-slate-400 mb-2 text-sm">
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
            <button
              onClick={() => onAnalysis(investment)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 
                hover:bg-blue-600 text-white rounded-lg transition-all duration-200 
                font-medium transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaRobot />
              <span>AI Analysis</span>
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
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true
  });

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
        }
        await fetchInvestments();
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);

      }
    };

    fetchData();
  }, []);

  const fetchInvestments = async () => {
    const { data, error } = await supabase
      .from('getinvestment')
      .select('*');

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
    setIsLoading(true)
    try {
      const { idea, description, amount, strategy } = formData;

      // Generate AI analysis
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Generate project proposal report for: ${idea}: ${description} for Rs.${amount}, with ${strategy}
            note: do not add ** to bold `
          }
        ],
        model: "llama-3.1-70b-versatile",
        temperature: 0.8,
        max_tokens: 1024,
        top_p: 1,
      });

      // Extract the AI analysis from the response
      const analysis = completion.choices?.[0]?.message?.content || 'Analysis not available';

      // Insert into Supabase
      const { error: insertError } = await supabase.from('getinvestment').insert([
        {
          ...formData,
          amount: parseFloat(formData.amount),
          user_id: session.user.id,
          ai_analysis: analysis
        }
      ]);

      if (insertError) throw insertError;

      await fetchInvestments();
      setIsLoading(false)
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
      setError(error.message || 'Failed to add investment. Please try again.');
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

  const handleAnalysis = (investment) => {
    setSelectedInvestment(investment);
    setShowAnalysisModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Get Funds</h1>
            <p className="text-slate-400">Explore Investors for your Idea</p>
          </div>

          <button
            onClick={() => setShowFormModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 
              text-white rounded-lg font-semibold transition-all duration-200 
              transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaPlus />
            <span>Add Your Idea</span>
          </button>
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
              onAnalysis={handleAnalysis}
              isOwner={session?.user?.id === investment.user_id}
            />
          ))}
        </div>

        {/* Approach Modal */}
        {showModal && selectedInvestment && (
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
                  <p className="text-lg font-medium text-emerald-400">&#8377;
                    {selectedInvestment.amount.toLocaleString()}
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

        {/* AI Analysis Modal */}
        {showAnalysisModal && selectedInvestment && (
          <Modal
            title="AI Investment Analysis"
            onClose={() => {
              setShowAnalysisModal(false);
              setSelectedInvestment(null);
            }}
          >
            <div className="space-y-6 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                  {selectedInvestment.idea}
                </h3>
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <p className="whitespace-pre-wrap text-slate-200">
                    {selectedInvestment.ai_analysis || 'No analysis available for this investment.'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 
                    text-white rounded-lg transition-colors"
                >
                  Close
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
                label="Amount (&#8377;)"
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