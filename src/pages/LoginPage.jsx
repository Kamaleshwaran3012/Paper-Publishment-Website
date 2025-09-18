import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";
import '../css/Loginpage.css';

const LoginPage = () => {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('No account found. Please sign up first.');
      navigate('/signup');
    } else if (storedUser.email === email && storedUser.password === password) {
      setUser(storedUser);
      navigate('/my-profile');
    } else {
      alert('Incorrect email or password');
    }
  };

  return (
    <div className='logcont'>
    <div className="login-container">
      <h2>🔐 Login</h2>
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
