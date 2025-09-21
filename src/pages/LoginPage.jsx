import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";
import '../css/Loginpage.css';

const LoginPage = () => {
  const { setUser } = useAppContext();
  const [authorId, setAuthorId] = useState(''); // Google Scholar ID
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', { // update backend route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId, password }) // send authorId instead of email
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Login successful!');
         setUser({
          id: data.user.id,
           name: data.user.name,
          authorId: data.user.authorId,
         affiliation: data.user.affiliation,
          });
        navigate('/profile'); // or wherever you want
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
            type="text"
            placeholder="Google Scholar ID"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
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
