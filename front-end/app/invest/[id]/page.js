'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FaTrash, FaSpinner, FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <FaSpinner className="animate-spin text-emerald-500 text-2xl" />
  </div>
);

// Proposal Modal Component
const ProposalModal = ({ request, onClose }) => (
  <>
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={onClose}
    />
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div
        className="bg-slate-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-2xl font-semibold text-white">Investment Proposal</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Investor</h3>
              <p className="text-xl font-semibold text-white">{request.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Amount Requested</h3>
              <p className="text-xl font-semibold text-emerald-400">
                ${request.amount?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Project Description</h3>
            <p className="text-slate-300 leading-relaxed">{request.description}</p>
          </div>

          {/* Strategy Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Investment Strategy</h3>
            <p className="text-slate-300 leading-relaxed">{request.strategy}</p>
          </div>

          {/* AI Analysis Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
              {request.ai_analysis ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {request.ai_analysis}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 italic">No AI analysis available</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="border-t border-slate-700 p-6 bg-slate-800/50">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);


// Request Card Component
const RequestCard = ({ request, onDelete, onClick }) => (
  <Card
    className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle className="text-xl text-white">{request.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-slate-300 line-clamp-2">{request.description}</p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-slate-400">Requested Amount</span>
            <p className="text-lg font-medium text-emerald-400">
              ${request.amount?.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-400">Status</span>
            <p className="text-slate-300 capitalize">{request.status || 'Pending'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(request.id);
            }}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
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
  const [selectedRequest, setSelectedRequest] = useState(null);

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

      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load investment requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('investment_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      await fetchRequests();
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
      }
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
                onClick={() => setSelectedRequest(request)}
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

        {selectedRequest && (
          <ProposalModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </div>
  );
};

export default InvestmentRequestsPage;

