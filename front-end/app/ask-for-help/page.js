'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
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