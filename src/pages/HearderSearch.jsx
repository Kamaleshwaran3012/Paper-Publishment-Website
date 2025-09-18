import React from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AuthorSearchBar from "../components/AuthorSearchBar";

const HeaderSearch = ({ isProfilePage }) => {
  const location = useLocation();

  // hide search for /signup and /login
  const hideSearch = location.pathname === "/signup" || location.pathname === "/login";

  return (
    <div className="px-4 mt-2">
      {!hideSearch && (isProfilePage ? <AuthorSearchBar /> : <SearchBar />)}
    </div>
  );
};

export default HeaderSearch;
