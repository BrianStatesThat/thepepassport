'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPendingSubmissionsAction, approveSubmissionAction, rejectSubmissionAction } from '@/app/actions/add-listing';
import { createClient } from '@/utils/supabase/client';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import type { ListingSubmission } from '@/lib/types';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<ListingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadSubmissions();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }
    setUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const loadSubmissions = async () => {
    try {
      const data = await getPendingSubmissionsAction();
      setSubmissions(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load submissions' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    setProcessing(submissionId);
    setMessage(null);

    try {
      const result = await approveSubmissionAction(submissionId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Listing approved and published!' });
        await loadSubmissions(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to approve listing' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (submissionId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessing(submissionId);
    setMessage(null);

    try {
      const result = await rejectSubmissionAction(submissionId, reason);
      if (result.success) {
        setMessage({ type: 'success', text: 'Listing rejected and cleaned up' });
        await loadSubmissions(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to reject listing' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setProcessing(null);
    }
  };

  if (loading || !user) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="mt-2 text-gray-600">Review and manage listing submissions</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Logged in as: {user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mx-8 mt-6 p-4 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <div className="px-8 py-6">
              {submissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No pending submissions</p>
                <p className="text-gray-400 mt-2">All caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-6">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {submission.listing_data.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Submitted by: {submission.submitted_by.name} ({submission.submitted_by.email})
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApprove(submission.id)}
                          disabled={processing === submission.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === submission.id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(submission.id)}
                          disabled={processing === submission.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Business Details</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Category:</span> {submission.listing_data.categories.join(', ')}</p>
                          <p><span className="font-medium">Address:</span> {submission.listing_data.location.address}</p>
                          {submission.listing_data.location.area && (
                            <p><span className="font-medium">Area:</span> {submission.listing_data.location.area}</p>
                          )}
                          {submission.listing_data.contact?.phone && (
                            <p><span className="font-medium">Phone:</span> {submission.listing_data.contact.phone}</p>
                          )}
                          {submission.listing_data.contact?.email && (
                            <p><span className="font-medium">Email:</span> {submission.listing_data.contact.email}</p>
                          )}
                          {submission.listing_data.price_range && (
                            <p><span className="font-medium">Price Range:</span> {submission.listing_data.price_range}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {submission.listing_data.description}
                        </p>
                        {submission.listing_data.long_description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {submission.listing_data.long_description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {submission.listing_data.images && submission.listing_data.images.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Images ({submission.listing_data.images.length})</h4>
                        <div className="flex space-x-2 overflow-x-auto">
                          {submission.listing_data.images.slice(0, 5).map((imageUrl, index) => (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`Image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-md shrink-0"
                            />
                          ))}
                          {submission.listing_data.images.length > 5 && (
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600 shrink-0">
                              +{submission.listing_data.images.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}