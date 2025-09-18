import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <div className="nav-links">
        <Link to="/profile">Profile</Link>
        <Link to="/library">My Library</Link>
        {/* <Link to="/account">My Account</Link> */}
      </div>
      <div className="profile-icon">K</div>
    </nav>
  );
};

export default Navbar;
