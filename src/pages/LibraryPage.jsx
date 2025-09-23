import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf"; // for PDF export
import "../css/LibraryPage.css";

const LibraryPage = () => {
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("csv"); // default csv

  const { user, loading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      if (location.pathname !== "/") {
        navigate("/login");
      }
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) return <p>Loading...</p>;
  if (!user && location.pathname !== "/") return null;

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
      const matchesSearch =
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.authors.toLowerCase().includes(searchTerm.toLowerCase());

      const pubYear = Number(pub.year);
      const matchesFrom = fromYear !== "" ? pubYear >= Number(fromYear) : true;
      const matchesTo = toYear !== "" ? pubYear <= Number(toYear) : true;

      return matchesSearch && matchesFrom && matchesTo;
    });
  };

  // Sorting logic
  const sortPublications = (list) => {
    if (sortOption === "yearAsc") return [...list].sort((a, b) => a.year - b.year);
    if (sortOption === "yearDesc") return [...list].sort((a, b) => b.year - a.year);
    if (sortOption === "authorAsc") return [...list].sort((a, b) => a.authors.localeCompare(b.authors));
    if (sortOption === "authorDesc") return [...list].sort((a, b) => b.authors.localeCompare(a.authors));
    return list;
  };

  const filtered = filterPublications(publications);
  const sorted = sortPublications(filtered);

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const currentPublications = sorted.slice(startIndex, startIndex + perPage);

  // Download as CSV
  const downloadCSV = () => {
    const headers = ["Title", "Authors", "Year", "Citations", "Link"];
    const rows = sorted.map((pub) => [
      pub.title,
      pub.authors,
      pub.year,
      pub.citation_count,
      pub.link || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "publications.csv";
    link.click();
  };

 // Download as PDF with wrapped text
const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("Research Publications", 14, 16);

  let y = 30;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const maxLineWidth = pageWidth - margin * 2; // usable width

  sorted.forEach((pub, idx) => {
    // Title (wrapped)
    const wrappedTitle = doc.splitTextToSize(`${idx + 1}. ${pub.title}`, maxLineWidth);
    doc.text(wrappedTitle, margin, y);
    y += wrappedTitle.length * 6; // adjust height for wrapped lines

    // Authors (wrapped)
    const wrappedAuthors = doc.splitTextToSize(`   Authors: ${pub.authors}`, maxLineWidth);
    doc.text(wrappedAuthors, margin, y);
    y += wrappedAuthors.length * 6;

    // Year + Citations (single line usually fits)
    doc.text(`   Year: ${pub.year} | Citations: ${pub.citation_count}`, margin, y);
    y += 10;
    // Add new page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("publications.pdf");
};


  // Handle download based on format
  const handleDownload = () => {
    if (downloadFormat === "csv") downloadCSV();
    else if (downloadFormat === "pdf") downloadPDF();
  };

  return (
    <div className="library-container">
      <h2>📚 Research Publications</h2>

      {/* Controls Row */}
      <div className="controls-row">
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

        <input
          type="number"
          placeholder="From Year"
          value={fromYear}
          onChange={(e) => {
            setFromYear(e.target.value);
            setCurrentPage(1);
          }}
        />
        <input
          type="number"
          placeholder="To Year"
          value={toYear}
          onChange={(e) => {
            setToYear(e.target.value);
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
      <p style={{ marginTop: "10px", fontWeight: "500" }}>
       <b>Total Results: {filtered.length}</b>
      </p>

      {/* Publications List */}
      <div className="publication-list">
        {currentPublications.length === 0 ? (
          <p className="no-pubs">No publications found.</p>
        ) : (
          currentPublications.map((pub, idx) => (
            <div key={idx} className="publication-card">
              <h3>{pub.title}</h3>
              <p><strong>Authors:</strong> {pub.authors}</p>
              <p><strong>Year:</strong> {pub.year}</p>
              <p><strong>Citations:</strong> {pub.citation_count}</p>
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
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>◀ Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next ▶</button>
        </div>
      )}

      {/* Download Section */}
      <div className="download-section">
        <select
          value={downloadFormat}
          onChange={(e) => setDownloadFormat(e.target.value)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            background: "#ffffffff",
            color: "black",
            border: "none",
            borderRadius: "5px"
          }}
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>
        <button onClick={handleDownload} style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}>⬇ Download</button>
      </div>
    </div>
  );
};

export default LibraryPage;
