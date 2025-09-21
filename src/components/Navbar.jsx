import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // assuming you have context
import "../css/Navbar.css";

const Navbar = () => {
  const { user, setUser } = useAppContext(); // get login state
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear user from context and localStorage
    setUser(null);
    localStorage.removeItem("user"); 
    navigate("/HomePage"); // redirect to login page
  };

  return (
    <nav>
      {/* Left side: Profile & Library */}
      <div className="nav-left">
        <Link to="/profile">Profile</Link>
        <Link to="/library">My Library</Link>
        <Link to="/author">Authors</Link>
      </div>

      {/* Right side: Signup/Login if not logged in, Logout if logged in */}
      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
