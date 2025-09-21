import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../css/AuthorPublicationPage.css";

const AuthorPublicationsPage = () => {
  const { authorId } = useParams(); // from route /author/:authorId
  const [author, setAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState(""); // 'yearAsc' or 'yearDesc'
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/my-publications/${authorId}`
        );
        setAuthor({ publications: res.data, authorId });
      } catch (err) {
        console.error("Error fetching author:", err);
      }
    };
    fetchAuthor();
  }, [authorId]);

  if (!author) return <p>Loading...</p>;

  // Filter publications by search term and year range
  const filteredPublications = author.publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFromYear = fromYear ? pub.year >= parseInt(fromYear) : true;
    const matchesToYear = toYear ? pub.year <= parseInt(toYear) : true;

    return matchesSearch && matchesFromYear && matchesToYear;
  });

  // Sort publications by year
  const sortedPublications = [...filteredPublications].sort((a, b) => {
    if (sortOption === "yearAsc") return a.year - b.year;
    if (sortOption === "yearDesc") return b.year - a.year;
    return 0;
  });

  return (
    <div className="author-publication-container">
      <h2>📚 Publications by Author</h2>
      <p>Scholar ID: {authorId}</p>
      <p>Total Publications: {author.publications.length}</p>
      <p><b>Showing: {sortedPublications.length} result</b></p>

      {/* Filters */}
      <div className="publication-filters">
        <input
          type="text"
          placeholder="Search by title or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="publication-search"
        />

        <input
          type="number"
          placeholder="From Year e.g. 2015"
          value={fromYear}
          onChange={(e) => setFromYear(e.target.value)}
          className="publication-year"
        />
        <input
          type="number"
          placeholder="To Year e.g. 2025"
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
          className="publication-year"
        />

      </div>

      {sortedPublications.length === 0 ? (
        <p>No publications found.</p>
      ) : (
        <ul className="publication-list">
          {sortedPublications.map((pub) => (
            <li key={pub._id} className="publication-card">
              <h3>{pub.title}</h3>
              <p><strong>Authors:</strong> {pub.authors}</p>
              <p><strong>Year:</strong> {pub.year}</p>
              <p><strong>Citations:</strong> {pub.citation_count}</p>
              {pub.link && (
                <a href={pub.link} target="_blank" rel="noopener noreferrer">
                  🔗 View Paper
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorPublicationsPage;
