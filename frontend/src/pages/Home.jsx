import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchGigs } from '../store/slices/gigSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { gigs, loading } = useSelector((state) => state.gigs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchGigs(searchQuery));
  }, [dispatch, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(searchQuery));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Browse Available Gigs
        </h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search gigs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading gigs...</p>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No gigs available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gig/${gig._id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {gig.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {gig.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${gig.budget}
                </span>
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
              <p className="text-sm text-gray-500 mt-2">
                Posted by: {gig.ownerId?.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

