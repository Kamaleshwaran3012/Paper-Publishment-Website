import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthorPage = () => {
  const [authors, setAuthors] = useState([]);
  const [expandedAuthor, setExpandedAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState(""); // 'custom', 'lastMonth', 'year'
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/authors-with-papers")
      .then((res) => setAuthors(res.data))
      .catch((err) => console.error(err));
  }, []);

  const toggleAuthor = (authorId) => {
    setExpandedAuthor(expandedAuthor === authorId ? null : authorId);
  };

  // Filter papers by date
  const filterAuthorPapers = (papers) => {
    return papers.filter((paper) => {
      const uploaded = new Date(paper.uploadedAt);
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

      return matchesDate;
    });
  };

  // Filter authors by search term
  const filteredAuthors = authors.filter((author) =>
    author.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>📚 Authors and Their Papers</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by author name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          marginBottom: "15px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />

      {/* Date Filter */}
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
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
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

      {filteredAuthors.map((author) => {
        const authorPaperList = filterAuthorPapers(author.papers || []);
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
            {/* Author Header */}
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

            {/* Dropdown Papers List */}
            {expandedAuthor === author._id && (
              <div style={{ marginTop: "10px", paddingLeft: "15px" }}>
                {authorPaperList.length === 0 ? (
                  <p>No papers found for this author.</p>
                ) : (
                  <ul>
                    {authorPaperList.map((p) => (
                      <li key={p._id} style={{ marginBottom: "10px" }}>
                        <strong>{p.title}</strong> <br />
                        <small>{p.abstract}</small> <br />
                        <a href={p.fileUrl} target="_blank" rel="noopener noreferrer">
                          {p.fileName}
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
      })}

      {filteredAuthors.length === 0 && <p>No authors found.</p>}
    </div>
  );
};

export default AuthorPage;
