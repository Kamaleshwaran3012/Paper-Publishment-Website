import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/AuthorPage.css";

const AuthorPage = () => {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/authors");
        setAuthors(res.data);
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
    };
    fetchAuthors();
  }, []);

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="author-container">
      <h2>👩‍🎓 Authors</h2>

      <input
        type="text"
        placeholder="Search by author name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="author-search"
      />

      {filteredAuthors.length === 0 && <p>No authors found.</p>}

      <div className="author-list">
        {filteredAuthors.map((author) => (
          <div key={author._id} className="author-card">
            <h3>
              {/* Navigate to AuthorPublicationsPage */}
              <Link
                to={`/author/${author.authorId}`}
                className="author-link"
              >
                {author.name}
              </Link>
            </h3>
            <p>Scholar ID: {author.authorId}</p>
           <p>Affiliation: {author.affiliation || "Not available"}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorPage;
