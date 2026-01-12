import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyBids } from '../store/slices/bidSlice';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, loading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bids</h1>

      {loading ? (
        <p className="text-gray-600">Loading your bids...</p>
      ) : myBids.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't submitted any bids yet.</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse available gigs →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                bid.status === 'hired'
                  ? 'border-l-4 border-green-500'
                  : bid.status === 'rejected'
                  ? 'border-l-4 border-red-500'
                  : 'border-l-4 border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    to={`/gig/${bid.gigId._id}`}
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {bid.gigId?.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Budget: ${bid.gigId?.budget}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              <p className="text-gray-700 mb-2">{bid.message}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-blue-600">
                  Your Bid: ${bid.price}
                </p>
                <p className="text-sm text-gray-500">
                  Gig Status: {bid.gigId?.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;

