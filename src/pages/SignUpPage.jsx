import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const SignUpPage = () => {
  const { setUser } = useContext(AppContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const userData = { name, email };

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Set to global context
    setUser(userData);

    // Navigate to profile
    navigate('/my-profile');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>
      <form onSubmit={handleSignUp}>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
