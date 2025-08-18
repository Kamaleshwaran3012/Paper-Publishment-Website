import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const MyAccountPage = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.setItem("loggedOut", "true");
    setUser(null);
    navigate('/signup');
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow bg-white">
      <div className="flex items-center justify-center mb-4">
        <img
          src="https://avatars.githubusercontent.com/u/1?v=4"
          alt="Avatar"
          className="w-20 h-20 rounded-full border-2 border-gray-300"
        />
      </div>

      <h2 className="text-2xl font-bold mb-2 text-center">My Account</h2>
      <p className="mb-2 text-gray-700 text-center">👤 {user?.name}</p>
      <p className="mb-6 text-gray-700 text-center">📧 {user?.email}</p>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default MyAccountPage;
