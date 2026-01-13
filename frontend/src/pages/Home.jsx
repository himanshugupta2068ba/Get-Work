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
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-cream/50 min-h-screen">
  {/* Header */}
  <div className="mb-10">
    <h1 className="text-4xl font-extrabold text-red-900 mb-3 tracking-tight text-center">
      Browse Available Gigs
    </h1>
    <p className="text-gray-500 mb-6 text-center italic">
      Discover opportunities that match your skills and start earning today.
    </p>

    {/* Search */}
    <form
      onSubmit={handleSearch}
      className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200"
    >
      <input
        type="text"
        placeholder="Search gigs by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 px-4 py-2 rounded-md border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium
                   transition-all duration-200
                   hover:bg-blue-700 hover:shadow-md active:scale-95"
      >
        Search
      </button>
    </form>
  </div>

  {/* States */}
  {loading ? (
    <div className="text-center py-20">
      <div className="inline-block animate-pulse text-gray-500">
        Loading gigs...
      </div>
    </div>
  ) : gigs.length === 0 ? (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">
        No gigs available at the moment.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {gigs.map((gig) => (
        <Link
          key={gig._id}
          to={`/gig/${gig._id}`}
          className="group bg-white rounded-2xl p-6
                     shadow-sm border border-gray-100
                     transition-all duration-300
                     hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2
                         group-hover:text-blue-600 transition">
            {gig.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-5 line-clamp-3">
            {gig.description}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
              ${gig.budget}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                gig.status === 'open'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {gig.status}
            </span>
          </div>

          {/* Owner */}
          <p className="text-sm text-gray-400 mt-4">
            Posted by{' '}
            <span className="font-medium text-gray-600">
              {gig.ownerId?.name}
            </span>
          </p>
        </Link>
      ))}
    </div>
  )}
</div>

  );
};

export default Home;

