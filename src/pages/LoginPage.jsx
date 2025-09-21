import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";
import '../css/Loginpage.css';

const LoginPage = () => {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', { // replace with your backend endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        alert('✅ Login successful!');
        setUser(data.user);
        navigate('/profile');
      } else {
        // Wrong credentials or user not found
        alert('❌ ' + data.error);
      }
    } catch (err) {
      alert('⚠️ Server error: ' + err.message);
    }
  };

  return (
    <div className='logcont'>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/signup">Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
