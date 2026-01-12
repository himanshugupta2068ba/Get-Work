import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initSocket } from '../utils/socket';
import { fetchMyBids } from '../store/slices/bidSlice';

const Notification = () => {
  const [notification, setNotification] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.id) return;

    const socket = initSocket(user.id);

    socket.on('hired', (data) => {
      setNotification({
        type: 'success',
        message: data.message,
        gigTitle: data.gigTitle,
      });
      // Refresh bids to show updated status
      dispatch(fetchMyBids());
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);

  if (!notification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{notification.message}</p>
            {notification.gigTitle && (
              <p className="text-sm mt-1 opacity-90">
                Project: {notification.gigTitle}
              </p>
            )}
          </div>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;

