import React from 'react';

const AuthorSearchBar = () => {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search Author Profiles..."
        className="border p-2 w-full"
      />
    </div>
  );
};

export default AuthorSearchBar;
