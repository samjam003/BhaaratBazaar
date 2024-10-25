'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { FaTrash } from 'react-icons/fa';

const InvestmentRequestsPage = () => {
    const router = useRouter();
    const { id } = router.query; // Get investment ID from the query parameters
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchRequests();
        }
    }, [id]);

    // Fetch investment requests based on investment ID
    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('investment_requests')
            .select('*')
            .eq('investment_id', id);

        if (error) {
            console.error('Error fetching requests:', error);
        } else {
            console.log('Fetched Requests:', data);
            setRequests(data);
        }
        setLoading(false);
    };

    const handleDeleteRequest = async (requestId) => {
        const { error } = await supabase
            .from('investment_requests')
            .delete()
            .eq('id', requestId);

        if (error) {
            console.error('Error deleting request:', error);
        } else {
            // Refresh requests after deletion
            fetchRequests();
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-semibold">Investment Requests</h1>

            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {requests.map((request) => (
                        <div key={request.id} className="p-4 border rounded shadow-sm">
                            <h2 className="text-lg font-semibold">{request.name}</h2>
                            <p className="text-sm">{request.description}</p>
                            <p className="text-sm font-medium">Requested Amount: ${request.amount}</p>
                            <p className="text-sm">Strategy: {request.strategy}</p>

                            {/* Delete Request Button */}
                            <button
                                onClick={() => handleDeleteRequest(request.id)}
                                className="mt-2 text-red-600 hover:text-red-800"
                                aria-label="Delete Request"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No requests found for this investment.</p>
            )}
        </div>
    );
};

export default InvestmentRequestsPage;
