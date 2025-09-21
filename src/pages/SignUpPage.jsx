import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "../css/signup.css";

const SignUpPage = () => {
  const { setUser } = useAppContext();
  const [name, setName] = useState("");
  const [authorId, setAuthorId] = useState(""); // Google Scholar ID
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
      // 1️⃣ Verify Google Scholar ID
      const verifyRes = await fetch("http://localhost:5000/verify-author-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.exists) {
        alert("❌ Invalid Google Scholar ID! Please enter a valid one.");
        return;
      }

      // 2️⃣ Signup
      const signupRes = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, authorId, password }),
      });
      const signupData = await signupRes.json();

      if (signupRes.ok) {
        localStorage.setItem("user", JSON.stringify(signupData.user));
        setUser(signupData.user);
        alert("✅ Signup successful!")
        navigate("/login");
      } else {
        alert("❌ Error: " + signupData.error);
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
          <input type="text" placeholder="Google Scholar ID" value={authorId} onChange={e => setAuthorId(e.target.value)} required />
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
