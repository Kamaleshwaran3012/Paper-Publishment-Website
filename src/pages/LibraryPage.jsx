import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/LibraryPage.css";

const LibraryPage = () => {
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortOption, setSortOption] = useState(""); // sort by year or author

// Only redirect after loading finishes
const { user, loading } = useAppContext();
const navigate = useNavigate();
const location = useLocation();


  useEffect(() => {
  if (!loading && !user) {
    // Only redirect if you want LibraryPage to be restricted
    // If LibraryPage is public, remove this block entirely
    if (location.pathname !== "/") {
      navigate("/login");
    }
  }
}, [user, loading, navigate, location.pathname]);


  if (loading) return <p>Loading...</p>;
  if (!user && location.pathname !== "/") return null; // prevent flicker

  const perPage = 10;

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/publications");
        const data = await res.json();
        setPublications(data);
      } catch (err) {
        console.error("Error fetching publications:", err);
      }
    };
    fetchPublications();
  }, []);

  // Filter + Search logic
  const filterPublications = (list) => {
    return list.filter((pub) => {
      // Search by title or authors
      const matchesSearch =
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by year
      const matchesYear = filterYear
        ? String(pub.year) === String(filterYear)
        : true;

      return matchesSearch && matchesYear;
    });
  };

  // Sorting logic
  const sortPublications = (list) => {
    if (sortOption === "yearAsc") {
      return [...list].sort((a, b) => a.year - b.year);
    }
    if (sortOption === "yearDesc") {
      return [...list].sort((a, b) => b.year - a.year);
    }
    if (sortOption === "authorAsc") {
      return [...list].sort((a, b) => a.authors.localeCompare(b.authors));
    }
    if (sortOption === "authorDesc") {
      return [...list].sort((a, b) => b.authors.localeCompare(a.authors));
    }
    return list;
  };

  const filtered = filterPublications(publications);
  const sorted = sortPublications(filtered);

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentPublications = sorted.slice(startIndex, startIndex + perPage);

  return (
    <div className="library-container">
      <h2>📚 Research Publications</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or authors..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-bar"
      />

      {/* Filter + Sort Controls */}
      <div className="filter-container">
        <input
          type="number"
          placeholder="Filter by year e.g. 2023"
          value={filterYear}
          onChange={(e) => {
            setFilterYear(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="yearAsc">Year ↑</option>
          <option value="yearDesc">Year ↓</option>
          <option value="authorAsc">Author A-Z</option>
          <option value="authorDesc">Author Z-A</option>
        </select>
      </div>

      {/* Publications List */}
      <div className="publication-list">
        {currentPublications.length === 0 ? (
          <p className="no-pubs">No publications found.</p>
        ) : (
          currentPublications.map((pub, idx) => (
            <div key={idx} className="publication-card">
              <h3>{pub.title}</h3>
              <p>
                <strong>Authors:</strong> {pub.authors}
              </p>
              <p>
                <strong>Year:</strong> {pub.year}
              </p>
              <p>
                <strong>Citations:</strong> {pub.citation_count}
              </p>
              {pub.link && (
                <a href={pub.link} target="_blank" rel="noopener noreferrer">
                  🔗 View Paper
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ◀ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
