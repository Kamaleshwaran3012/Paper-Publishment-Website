import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 shadow bg-white">
      <div className="flex gap-4">
        <Link to="/profile" className="text-blue-600 font-medium hover:underline">
          Profile
        </Link>
        <Link to="/library" className="text-blue-600 font-medium hover:underline">
          My Library
        </Link>
        <Link to="/account" className="nav-link">My Account</Link>
      </div>
      <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
        K
      </div>
    </nav>
  );
};

export default Navbar;
