'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        </div>
    );
};

export default Page;