import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";

const SignUpPage = () => {
  const { setUser } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = { name, email, password };

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/my-profile');
    sessionStorage.removeItem("loggedOut");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">📝 Create Account</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input className="w-full p-2 border rounded" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full p-2 border rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full p-2 border rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="w-full p-2 border rounded" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpPage;