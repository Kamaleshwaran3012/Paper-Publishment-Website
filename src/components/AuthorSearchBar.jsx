// src/components/AuthorSearch.jsx
import React, { useState } from "react";

const AuthorSearch = () => {
  const [authorId, setAuthorId] = useState("");
  const [authorData, setAuthorData] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/author/${authorId}`);
      const data = await response.json();
      setAuthorData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="author-search">
      <h1>Google Scholar Author Search</h1>
      <input
        type="text"
        placeholder="Enter Google Scholar Author ID"
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {authorData && (
        <div className="author-info">
          <h2>{authorData.author?.name}</h2>
          <p>{authorData.author?.affiliations}</p>
          <p>Cited by: {authorData.cited_by?.table[0]?.citations?.all}</p>

          <h3>Publications</h3>
          <ul>
            {authorData.articles?.slice(0, 5).map((article, index) => (
              <li key={index}>
                <strong>{article.title}</strong> ({article.year})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuthorSearch;
