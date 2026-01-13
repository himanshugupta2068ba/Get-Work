import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center
                bg-gradient-to-br from-blue-50 via-white to-purple-50
                py-12 px-4 sm:px-6 lg:px-8">

  <div className="max-w-md w-full">
    
    {/* Card */}
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Create your GigFlow account
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition placeholder-gray-400"
          />

          {/* Email */}
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition placeholder-gray-400"
          />

          {/* Password */}
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition placeholder-gray-400"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center
                     bg-gradient-to-r from-blue-600 to-purple-600
                     text-white font-semibold py-3 rounded-lg
                     transition-all duration-200
                     hover:from-blue-700 hover:to-purple-700
                     hover:shadow-lg active:scale-95
                     disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </div>
  </div>
</div>
  );
};

export default Register;

