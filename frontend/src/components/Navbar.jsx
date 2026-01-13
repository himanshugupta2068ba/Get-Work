import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
  <nav className="bg-[#f8dfbe]/20 backdrop-blur-md shadow-md sticky top-0 z-50 transition-shadow duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      
      {/* Logo */}
      <div className="flex items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-tight hover:scale-105 transform transition duration-200"
        >
         GIG▸FLOW

        </Link>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-2">
        {isAuthenticated ? (
          <>
            {[
              { to: '/', label: 'Browse Gigs' },
              { to: '/create-gig', label: 'Post a Gig' },
              { to: '/my-gigs', label: 'My Gigs' },
              { to: '/my-bids', label: 'My Bids' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="relative px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200
                           hover:text-blue-600
                           after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0
                           after:bg-blue-600 after:transition-all after:duration-300
                           hover:after:w-full"
              >
                {label}
              </Link>
            ))}

            {/* User name */}
            <span className="px-3 py-2 text-sm font-medium text-gray-500">
              {user?.name}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium
                         transition-all duration-200
                         hover:bg-red-600 hover:shadow-md active:scale-95"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-2 text-sm font-medium text-gray-700
                         transition-colors duration-200 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium
                         transition-all duration-200
                         hover:bg-blue-700 hover:shadow-md active:scale-95"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  </div>
</nav>

  );
};

export default Navbar;

