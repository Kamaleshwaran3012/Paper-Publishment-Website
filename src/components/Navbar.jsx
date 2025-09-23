import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // assuming you have context
import "../css/navbar.css";

const Navbar = () => {
  const { user, setUser } = useAppContext(); // get login state
  const navigate = useNavigate();

   const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      setUser(null); // clears state and localStorage
      navigate("/");
    }
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/profile">Profile</Link>
        <Link to="/library">My Library</Link>
        <Link to="/author">Authors</Link>
      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/signup" style={{color:"orange"}}>Signup</Link>
            <Link to="/login" style={{color:"green"}}>Login</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout} style={{color:"red"}}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
