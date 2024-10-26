'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FaTrash, FaSpinner } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <FaSpinner className="animate-spin text-emerald-500 text-2xl" />
  </div>
);

// Request Card Component
const RequestCard = ({ request, onDelete }) => (
  <Card className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
    <CardHeader>
      <CardTitle className="text-xl text-white">{request.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-slate-300">{request.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-slate-400">Requested Amount</span>
            <p className="text-lg font-medium text-emerald-400">
              ${request.amount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-400">Strategy</span>
            <p className="text-slate-300">{request.strategy}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <button
            onClick={() => onDelete(request.id)}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Delete Request"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const InvestmentRequestsPage = () => {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchRequests();
    }
  }, [id]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('investment_requests')
        .select('*')
        .eq('investment_id', id);

      if (error) throw error;

      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load investment requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('investment_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Failed to delete request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Investment Requests</h1>
          <p className="text-slate-400">Manage and review investment requests</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : requests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="flex items-center justify-center p-12">
              <p className="text-slate-400 text-lg">
                No requests found for this investment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InvestmentRequestsPage;