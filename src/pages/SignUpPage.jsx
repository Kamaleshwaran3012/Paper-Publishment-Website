import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "../css/signup.css";

const SignUpPage = () => {
  const { setUser } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/login");
        console.log("✅ Signup successful!");
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      alert("⚠️ Server error: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title"> Sign-Up</h2>
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button className="but" type="submit">🚀 Sign Up</button>
        </form>
        <p>
          Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
