'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { Modal } from '@/components/Modal';
import QueryComponent from './QueryComponent';

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [queries, setQueries] = useState([]); // State to hold fetched queries
    const [userId, setUserId] = useState('your_user_id'); // Assume you have user_id available

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleReply = () => {
        console.log('ehlo');
    };

    // Handle query submission to Supabase
    const handlePost = async () => {
        if (query.trim()) {
            const { data, error } = await supabase
                .from('query') // Table name in Supabase
                .insert([
                    {
                        user_id: "20090c90-a672-4996-9c67-0899fe97dda1", // Insert your user_id here
                        query: query, // Query input
                    },
                ]);

            if (error) {
                console.error('Error inserting query:', error.message);
            } else {
                console.log('Query submitted successfully:', data);
                setQuery(''); // Clear the input field after submission
                fetchQueries(); // Fetch queries again after posting a new one
            }
        } else {
            console.log('Query cannot be empty');
        }
    };

    // Fetch queries from Supabase
    const fetchQueries = async () => {
        const { data, error } = await supabase
            .from('query') // Table name in Supabase
            .select('*'); // Fetch all fields from the 'query' table

        if (error) {
            console.error('Error fetching queries:', error.message);
        } else {
            setQueries(data); // Set the fetched queries in state
        }
    };

    // Fetch queries when the component mounts
    useEffect(() => {
        fetchQueries(); // Fetch queries initially
    }, []);

    return (
        <div>
            <div>
                <input
                    type='text'
                    placeholder='Add your problem'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handlePost}>this is Post button</button>
            </div>

            {/* Display fetched queries */}
            <div>
                <h2>Fetched Queries:</h2>
                {queries.length > 0 ? (
                    queries.map((q) => (
                        <div key={q.id} className="query-item">
                            <p><strong>User ID:</strong> {q.user_id}</p>
                            <p><strong>Query:</strong> {q.query}</p>
                            <div>
                                <button onClick={openModal} >reply</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No queries found.</p>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default Page;
