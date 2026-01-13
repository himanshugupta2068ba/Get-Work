import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig, clearError } from '../store/slices/gigSlice';

const CreateGig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.gigs);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      createGig({
        ...formData,
        budget: parseFloat(formData.budget),
      })
    );
    if (createGig.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Heading */}
    <div className="text-center mb-10">
      <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">
        Post a New Gig
      </h1>
      <p className="mt-2 text-gray-500">
        Share your opportunity and find the right talent fast
      </p>
    </div>

    {/* Form Card */}
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
    >
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Gig Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition"
            placeholder="e.g. Build a React landing page"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows="6"
            className="w-full px-4 py-2 rounded-md border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition resize-none"
            placeholder="Explain the gig requirements, timeline, and expectations"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Budget ($)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 rounded-md border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition"
            placeholder="Enter your budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-md
                       transition-all duration-200
                       hover:bg-blue-700 hover:shadow-md
                       active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Gig'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-md
                       transition-all duration-200
                       hover:bg-gray-200 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</div>

  );
};

export default CreateGig;

