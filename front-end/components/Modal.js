"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client

export const Modal = ({ isOpen, onClose }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isPublic, setIsPublic] = useState(true); // State for PUBLIC/PRIVATE toggle

    // Fetch comments from Supabase
    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments') // Table name in Supabase
            .select('*') // Fetch all fields from the 'comments' table
            .eq('type', 'PUBLIC'); // Filter where 'type' is equal to 'PUBLIC'

        if (error) {
            console.error('Error fetching comments:', error.message);
        } else {
            setComments(data); // Set the fetched comments in state
        }
    };


    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen]); // Fetch comments only when the modal opens

    // Handle comment submission to Supabase
    const handleCommentSubmit = async () => {
        if (comment.trim()) {
            const { data, error } = await supabase
                .from('comments') // Table name in Supabase
                .insert([
                    {
                        user_id: "9ec6e7c9-2adb-4f91-8ccc-2468bec4e326", // Replace with the actual user_id
                        comment: comment, // Comment input
                        type: isPublic ? "PUBLIC" : "PRIVATE" // Check if comment is PUBLIC or PRIVATE
                    },
                ]);

            if (error) {
                console.error('Error inserting comment:', error.message);
            } else {
                console.log('Comment submitted successfully:', data);
                setComment(''); // Clear the input field after submission
                fetchComments(); // Fetch comments again after posting a new one
            }
        } else {
            console.log('Comment cannot be empty');
        }
    };

    if (!isOpen) return null; // Only render the modal if it's open

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white w-[500px] h-[500px] rounded-lg shadow-lg p-4 relative">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Modal Title</h2>
                    <p>This is your modal content. You can add anything here!</p>

                    <input
                        type="text"
                        placeholder="Your reply"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border rounded px-2 py-1"
                    />

                    {/* Toggle button for PUBLIC/PRIVATE comment */}
                    <div className="mt-2 flex items-center justify-center">
                        <label className="mr-2">Public</label>
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={() => setIsPublic(!isPublic)} // Toggle between PUBLIC and PRIVATE
                            className="toggle-checkbox"
                        />
                        <label className="ml-2">Private</label>
                    </div>

                    <button
                        onClick={handleCommentSubmit}
                        className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mt-4"
                    >
                        Submit
                    </button>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold">Comments:</h3>
                    {comments.length > 0 ? (
                        comments.map((c, index) => (
                            <div key={index} className="border-b py-2">
                                {c.comment} ({c.type}) {/* Display whether the comment is PUBLIC or PRIVATE */}
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
