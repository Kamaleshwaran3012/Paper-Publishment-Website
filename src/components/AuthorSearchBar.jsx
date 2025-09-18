import React from 'react';
import '../css/AuthorSearchBar.css'; // import css file

const AuthorSearchBar = () => {
  return (
    <div className="author-search-container">
      <input
        type="text"
        placeholder="Search Author Profiles..."
        className="author-search-input"
      />
    </div>
  );
};

export default AuthorSearchBar;
