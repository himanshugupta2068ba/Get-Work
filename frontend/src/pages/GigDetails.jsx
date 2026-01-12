import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { submitBid } from '../store/slices/bidSlice';
import { fetchBidsForGig } from '../store/slices/bidSlice';
import { hireFreelancer } from '../store/slices/bidSlice';
import { fetchGigs } from '../store/slices/gigSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { bids, loading: bidsLoading } = useSelector((state) => state.bids);
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidForm, setBidForm] = useState({ message: '', price: '' });
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/gigs/${id}`);
        setGig(response.data);
        setIsOwner(
          isAuthenticated && user?.id === response.data.ownerId._id.toString()
        );
        if (isAuthenticated && user?.id === response.data.ownerId._id.toString()) {
          dispatch(fetchBidsForGig(id));
        }
      } catch (error) {
        console.error('Error fetching gig:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id, isAuthenticated, user, dispatch]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      submitBid({
        gigId: id,
        message: bidForm.message,
        price: parseFloat(bidForm.price),
      })
    );
    if (submitBid.fulfilled.match(result)) {
      setShowBidForm(false);
      setBidForm({ message: '', price: '' });
      alert('Bid submitted successfully!');
    }
  };

  const handleHire = async (bidId) => {
    if (
      window.confirm(
        'Are you sure you want to hire this freelancer? This action cannot be undone.'
      )
    ) {
      const result = await dispatch(hireFreelancer(bidId));
      if (hireFreelancer.fulfilled.match(result)) {
        dispatch(fetchBidsForGig(id));
        dispatch(fetchGigs());
        // Refresh gig data
        const response = await axios.get(`${API_URL}/api/gigs/${id}`);
        setGig(response.data);
        alert('Freelancer hired successfully!');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Loading gig details...</p>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Gig not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              gig.status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {gig.status}
          </span>
        </div>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
          {gig.description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Posted by</p>
            <p className="font-medium">{gig.ownerId?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Budget</p>
            <p className="text-3xl font-bold text-blue-600">${gig.budget}</p>
          </div>
        </div>
      </div>

      {isAuthenticated && !isOwner && gig.status === 'open' && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Submit a Bid
            </button>
          ) : (
            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="bid-message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Proposal
                </label>
                <textarea
                  id="bid-message"
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe why you're the best fit for this gig..."
                  value={bidForm.message}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, message: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="bid-price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Price ($)
                </label>
                <input
                  type="number"
                  id="bid-price"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your bid amount"
                  value={bidForm.price}
                  onChange={(e) =>
                    setBidForm({ ...bidForm, price: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Submit Bid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBidForm(false);
                    setBidForm({ message: '', price: '' });
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {isOwner && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bids</h2>
          {bidsLoading ? (
            <p className="text-gray-600">Loading bids...</p>
          ) : bids.length === 0 ? (
            <p className="text-gray-600">No bids yet.</p>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className={`border rounded-lg p-4 ${
                    bid.status === 'hired'
                      ? 'border-green-500 bg-green-50'
                      : bid.status === 'rejected'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {bid.freelancerId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bid.freelancerId?.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ${bid.price}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          bid.status === 'hired'
                            ? 'bg-green-100 text-green-800'
                            : bid.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{bid.message}</p>
                  {bid.status === 'pending' && gig.status === 'open' && (
                    <button
                      onClick={() => handleHire(bid._id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
                    >
                      Hire This Freelancer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GigDetails;

