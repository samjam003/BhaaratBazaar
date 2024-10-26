'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
<<<<<<< HEAD
import { FaReply, FaPlus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

// Query Card Component
const QueryCard = ({ query, onReply }) => (
  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-200 shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {query.user_id.slice(0, 1).toUpperCase()}
          </span>
=======
import Modal from '@/components/Modal';
import { Send, MessageCircle } from 'lucide-react';

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [queries, setQueries] = useState([]);
    const [userId, setUserId] = useState('your_user_id');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleReply = () => {
        console.log('ehlo');
    };

    const handlePost = async () => {
        if (query.trim()) {
            const { data, error } = await supabase
                .from('query')
                .insert([
                    {
                        user_id: "20090c90-a672-4996-9c67-0899fe97dda1",
                        query: query,
                    },
                ]);

            if (error) {
                console.error('Error inserting query:', error.message);
            } else {
                console.log('Query submitted successfully:', data);
                setQuery('');
                fetchQueries();
            }
        }
    };

    const fetchQueries = async () => {
        const { data, error } = await supabase
            .from('query')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching queries:', error.message);
        } else {
            setQueries(data);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlePost();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 w-full z-10">
                <h1 className="text-xl font-semibold flex items-center gap-2 md:px-28">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                    Public Chat
                </h1>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 mt-4 mb-24 md:px-28">
                {queries.length > 0 ? (
                    <div className="space-y-4">
                        {queries.map((q) => (
                            <div 
                                key={q.id} 
                                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-500 font-semibold">
                                                {q.user_id.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">User {q.user_id.slice(0, 8)}</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(q.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={openModal}
                                        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                    >
                                        Reply
                                    </button>
                                </div>
                                <p className="mt-3 text-gray-700 pl-13 p-6 py-4">{q.query}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-2 text-gray-400" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
            </div>

            {/* Input Container */}
            <div className="fixed bottom-0 w-full bg-white border-t shadow-lg p-4">
                <div className="max-w-4xl mx-auto flex gap-2">
                    <textarea
                        className="flex-1 resize-none border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        rows="1"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        onClick={handlePost}
                        disabled={!query.trim()}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            query.trim() 
                                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <Send className="w-5 h-5" />
                        Send
                    </button>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} />
>>>>>>> e87504dddbd2c6ec96c1dfd0fc90199f2a933632
        </div>
        <p className="text-slate-300 text-sm">{query.user_id}</p>
      </div>
    </div>
    
    <p className="text-white text-lg mb-4">{query.query}</p>
    
    <div className="flex gap-3">
      <button
        onClick={() => onReply(query)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
          bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg 
          transition-colors duration-200 font-medium"
      >
        <FaReply className="text-lg" />
        <span>Reply</span>
      </button>
    </div>
  </div>
);

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

// Main Page Component
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reply, setReply] = useState('');

  const fetchQueries = async () => {
    const { data, error } = await supabase
      .from('query')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching queries:', error);
    } else {
      setQueries(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (query.trim()) {
      const { error } = await supabase
        .from('query')
        .insert([{
          user_id: "20090c90-a672-4996-9c67-0899fe97dda1",
          query: query,
        }]);

      if (error) {
        console.error('Error posting query:', error);
      } else {
        setQuery('');
        await fetchQueries();
      }
    }
    setIsLoading(false);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('replies')
        .insert([{
          query_id: selectedQuery.id,
          user_id: "20090c90-a672-4996-9c67-0899fe97dda1",
          reply: reply,
        }]);

      if (error) throw error;

      setReply('');
      setIsModalOpen(false);
      setSelectedQuery(null);
      await fetchQueries();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
    setIsLoading(false);
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
            <h1 className="text-3xl font-bold text-white mb-2">Community Queries</h1>
            <p className="text-slate-400">Ask questions and get answers from the community</p>
          </div>

          <form onSubmit={handlePost} className="flex gap-3">
            <FormInput
              label=""
              id="query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What's your question?"
              required
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 
                text-white rounded-lg font-semibold transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus />
              <span>Post</span>
            </button>
          </form>
        </div>

        {queries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {queries.map((q) => (
              <QueryCard
                key={q.id}
                query={q}
                onReply={(query) => {
                  setSelectedQuery(query);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">No queries found</p>
          </div>
        )}

        {/* Reply Modal */}
        {isModalOpen && selectedQuery && (
          <Modal
            title="Reply to Query"
            onClose={() => {
              setIsModalOpen(false);
              setSelectedQuery(null);
              setReply('');
            }}
          >
            <form onSubmit={handleReply} className="space-y-6">
              <div className="p-4 bg-slate-700 rounded-lg mb-4">
                <p className="text-slate-300">{selectedQuery.query}</p>
              </div>

              <FormInput
                label="Your Reply"
                id="reply-input"
                type="textarea"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Enter your reply..."
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedQuery(null);
                    setReply('');
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !reply.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  )}
                  Submit Reply
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Page;