import React from 'react';
import '../css/AuthorSearchBar.css'; // import css file

const SearchBar = () => {
  return (
    <div className="author-search-container">
      <input
        type="text"
        placeholder="Search for publications..."
        className="author-search-input"
      />
    </div>
  );
};

export default SearchBar;
