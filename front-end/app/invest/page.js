'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { FaHandshake, FaEye, FaPlus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Groq from 'groq-sdk';

// Investment Card Component
const InvestmentCard = ({ investment, onRequest, session }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(investment.amount);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-200 shadow-lg">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-white mb-2">{investment.idea}</h2>
        <span className="text-emerald-400 font-medium text-lg">
          {formattedAmount}
        </span>
      </div>
      
      <p className="text-slate-300 mb-4 line-clamp-2">{investment.description}</p>
      
      {investment.users && (
        <div className="border-t border-slate-700 pt-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {investment.users.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-slate-300 font-medium">{investment.users.name}</p>
              <p className="text-slate-400 text-sm">{investment.users.email}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        {session?.user?.id !== investment.user_id && (
          <button
            onClick={() => onRequest(investment)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 
              hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <FaHandshake className="text-lg" />
            <span>Approach</span>
          </button>
        )}
        <Link href={`/invest/${investment.id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
            bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200 font-medium">
            <FaEye className="text-lg" />
            <span>Details</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-slate-800 rounded-xl shadow-xl w-full max-w-md animate-in fade-in duration-200">
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1"
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
const FormInput = ({ label, id, type = "text", value, onChange, placeholder, required = false }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-300">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 
          text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 
          focus:border-transparent min-h-[100px] resize-none"
      />
    ) : (
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 
          text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 
          focus:border-transparent"
      />
    )}
  </div>
);

// Main Investment Page Component
const InvestmentPage = () => {
  const [investments, setInvestments] = useState([]);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strategy, setStrategy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentSession = await getSession();
        setSession(currentSession);

        if (!currentSession) {
          console.error('User not authenticated');
          return;
        }

        await fetchInvestments();
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchInvestments = async () => {
    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        users (name, email)
      `)
    

    if (error) {
      console.error('Error fetching investments:', error);
    } else {
      setInvestments(data);
    }
  };

  const handleAddInvestment = async (event) => {
    event.preventDefault();
    setIsLoading(true);
console.log(chatCompletion.choices[0]?.message?.content)
    try {
      const { error } = await supabase.from('investments').insert([
        {
          idea: `Investment Opportunity ${investments.length + 1}`,
          description: `A new investment opportunity with a budget of $${amount}`,
          amount: parseFloat(amount),
          strategy: "To be defined",
          user_id: session.user.id,
          ai_analysis: chatCompletion.choices[0]?.message?.content || '',
        },
      ]);

      if (error) throw error;

      await fetchInvestments();
      setShowInvestmentModal(false);
      setAmount('');
    } catch (error) {
      console.error('Error adding investment:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInvestmentRequest = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Generate AI analysis
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Generate project proposal report for: ${name}: ${description} for $${amount}, with ${strategy}`
          }
        ],
        model: "llama-3.1-70b-versatile",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
      });

      const { error } = await supabase.from('investment_requests').insert([
        { 
          investment_id: selectedInvestment.id,
          user_id: session.user.id,
          name,
          description,
          amount: parseFloat(amount),
          strategy,
          ai_analysis: chatCompletion.choices[0]?.message?.content || '',

        }
      ]);

      if (error) throw error;

      await fetchInvestments();
      resetRequestForm();
      setShowRequestModal(false);
    } catch (error) {
      console.error('Error adding investment request:', error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const resetRequestForm = () => {
    setName('');
    setDescription('');
    setAmount('');
    setStrategy('');
    setSelectedInvestment(null);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Investment Opportunities</h1>
            <p className="text-slate-400">Discover and connect with potential investors</p>
          </div>
          
          <button 
            onClick={() => setShowInvestmentModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 
              text-white rounded-lg font-semibold transition-colors duration-200"
          >
            <FaPlus />
            <span>Add Investment</span>
          </button>
        </div>

        {investments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investments.map((investment) => (
              <InvestmentCard 
                key={investment.id}
                investment={investment}
                onRequest={(inv) => {
                  setSelectedInvestment(inv);
                  setShowRequestModal(true);
                }}
                session={session}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No investment opportunities found</p>
            <button
              onClick={() => setShowInvestmentModal(true)}
              className="text-emerald-500 hover:text-emerald-400 font-medium"
            >
              Create the first one
            </button>
          </div>
        )}

        {/* Add Investment Modal */}
        {showInvestmentModal && (
          <Modal 
            title="Add Investment" 
            onClose={() => setShowInvestmentModal(false)}
          >
            <form onSubmit={handleAddInvestment} className="space-y-6">
              <FormInput
                label="Investment Amount"
                id="investment-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in USD"
                required
              />
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInvestmentModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  )}
                  Add Investment
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Investment Request Modal */}
        {showRequestModal && (
          <Modal 
            title="Investment Request" 
            onClose={() => {
              setShowRequestModal(false);
              resetRequestForm();
            }}
          >
            <form onSubmit={handleAddInvestmentRequest} className="space-y-6">
              <FormInput
                label="Your Name"
                id="request-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              
              <FormInput
                label="Description"
                id="request-description"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your investment request"
                required
              />
              
              <FormInput
                label="Requested Amount"
                id="request-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in USD"
                required
              />
              
              <FormInput
                label="Strategy"
                id="request-strategy"
                type="textarea"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Describe your investment strategy"
                required
              />
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    resetRequestForm();
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  )}
                  Submit Request
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