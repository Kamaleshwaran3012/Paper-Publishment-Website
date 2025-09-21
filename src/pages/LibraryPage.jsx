import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/LibraryPage.css";

const LibraryPage = () => {
  const [papers, setPapers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [expandedAuthor, setExpandedAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState(""); // 'custom', 'lastMonth', 'year'
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterBy, setFilterBy] = useState("papers"); // 'papers' or 'author'

  // Fetch all papers and authors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const papersRes = await axios.get("http://localhost:5000/papers");
        setPapers(papersRes.data);
        const authorsRes = await axios.get("http://localhost:5000/users");
        setAuthors(authorsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const toggleAuthor = (authorId) => {
    setExpandedAuthor(expandedAuthor === authorId ? null : authorId);
  };

  // Filter papers by search and date
  const filterPapers = (list) => {
    return list.filter((paper) => {
      const uploaded = new Date(paper.uploadedAt);

      // Search filter
      const matchesSearch =
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.author.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter
      let matchesDate = true;

      if (filterOption === "custom" && fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        matchesDate = uploaded >= from && uploaded <= to;
      }

      if (filterOption === "lastMonth") {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        matchesDate =
          uploaded.getFullYear() === lastMonth.getFullYear() &&
          uploaded.getMonth() === lastMonth.getMonth();
      }

      if (filterOption === "year" && filterYear) {
        matchesDate = uploaded.getFullYear() === parseInt(filterYear);
      }

      return matchesSearch && matchesDate;
    });
  };

  const filteredPapers = filterPapers(papers);

  return (
    <div className="library-container">
      <h2>📖 Library</h2>


      {/* Search Bar */}
      <input
        type="text"
        placeholder={
          filterBy === "papers"
            ? "Search papers by title or author..."
            : "Search authors..."
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "700px",
        }}
      />

      {/* Date Filter (only for Papers) */}
      {(
        <div style={{ marginBottom: "20px" }}>
          <select
            value={filterOption}
            onChange={(e) => {
              setFilterOption(e.target.value);
              setFromDate("");
              setToDate("");
              setFilterYear("");
            }}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="">Select date filter</option>
            <option value="custom">Custom Date</option>
            <option value="lastMonth">Last Month</option>
            <option value="year">Enter Year</option>
          </select>

          {filterOption === "custom" && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          )}

          {filterOption === "year" && (
            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
              <input
                type="number"
                placeholder="Enter year e.g. 2025"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{ width: "250px" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Display Papers */}
      {filterBy === "papers" ? (
        filteredPapers.length === 0 ? (
          <p>No papers found.</p>
        ) : (
          <ul className="papers-list">
            {filteredPapers.map((paper) => (
              <li key={paper._id} className="paper-card">
                <strong>Title:</strong> {paper.title} <br />
                <strong>Author:</strong> {paper.author.name} ({paper.author.email}) <br />
                <strong>Abstract:</strong> {paper.abstract} <br />
                <strong>Uploaded At:</strong> {new Date(paper.uploadedAt).toLocaleString()} <br />
                <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              </li>
            ))}
          </ul>
        )
      ) : (
        // Display Authors
        authors
          .filter((author) =>
            author.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((author) => {
            const authorPaperList = filterPapers(
              papers.filter((p) => p.author._id === author._id)
            );
            return (
              <div
                key={author._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "12px",
                  margin: "10px 0",
                }}
              >
                <h3
                  style={{
                    cursor: "pointer",
                    margin: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => toggleAuthor(author._id)}
                >
                  {author.name} ({authorPaperList.length} papers)
                  <span>{expandedAuthor === author._id ? "▲" : "▼"}</span>
                </h3>

                {expandedAuthor === author._id && (
                  <div style={{ marginTop: "10px", paddingLeft: "15px" }}>
                    {authorPaperList.length === 0 ? (
                      <p>No papers found.</p>
                    ) : (
                      <ul>
                        {authorPaperList.map((p) => (
                          <li key={p._id} style={{ marginBottom: "10px" }}>
                            <strong>{p.title}</strong> <br />
                            <small>{p.abstract}</small> <br />
                            <a href={p.fileUrl} target="_blank" rel="noopener noreferrer">
                              View PDF
                            </a>
                            <br />
                            <small>Uploaded: {new Date(p.uploadedAt).toLocaleString()}</small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })
      )}
    </div>
  );
};

export default LibraryPage;
