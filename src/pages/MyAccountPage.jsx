import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const MyAccountPage = () => {
  const { user, setUser, setPapers } = useAppContext();
  const navigate = useNavigate();

 const handleLogout = () => {
  // ❌ Don't clear localStorage
  sessionStorage.setItem("loggedOut", "true"); // optional flag
  setUser(null);         // remove current user from memory
  navigate('/signup');   // redirect to signup/login page
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <p className="mb-4 text-gray-700">Name: {user?.name}</p>
      <p className="mb-4 text-gray-700">Email: {user?.email}</p>

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
