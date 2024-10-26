import React, { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';

const Modal = ({ isOpen, onClose }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('type', 'PUBLIC');

    if (error) {
      console.error('Error fetching comments:', error.message);
    } else {
      setComments(data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            user_id: "9ec6e7c9-2adb-4f91-8ccc-2468bec4e326",
            comment: comment,
            type: isPublic ? "PUBLIC" : "PRIVATE"
          },
        ]);

      if (error) {
        console.error('Error inserting comment:', error.message);
      } else {
        console.log('Comment submitted successfully:', data);
        setComment('');
        fetchComments();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] max-h-[90vh] rounded-lg shadow-xl transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comment List */}
        <div className="px-6 py-4 max-h-[300px] overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {c.user_id.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {c.type === 'PUBLIC' ? 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Public
                      </span> 
                      : 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Private
                      </span>
                    }
                  </span>
                </div>
                <p className="text-gray-700 ml-10">{c.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full transition-colors">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {isPublic ? 'Public' : 'Private'} comment
              </span>
            </label>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;