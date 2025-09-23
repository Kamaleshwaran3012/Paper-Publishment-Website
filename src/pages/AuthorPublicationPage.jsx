import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "../css/AuthorPublicationPage.css";

const PAGE_SIZE = 10; // 10 publications per page

const AuthorPublicationsPage = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [publications, setPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("csv");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAuthorAndPubs = async () => {
      try {
        // Fetch author info
        const authorRes = await axios.get(
          `http://localhost:5000/api/author/${authorId}`
        );
        setAuthor(authorRes.data);

        // Fetch publications
        const pubsRes = await axios.get(
          `http://localhost:5000/api/my-publications/${authorId}`
        );
        setPublications(pubsRes.data);
      } catch (err) {
        console.error("Error fetching author or publications:", err);
      }
    };
    fetchAuthorAndPubs();
  }, [authorId]);

  if (!author) return <p>Loading...</p>;

  // Filter
  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFromYear = fromYear ? pub.year >= parseInt(fromYear) : true;
    const matchesToYear = toYear ? pub.year <= parseInt(toYear) : true;
    return matchesSearch && matchesFromYear && matchesToYear;
  });

  // Sort
  const sortedPublications = [...filteredPublications].sort((a, b) => {
    if (sortOption === "yearAsc") return a.year - b.year;
    if (sortOption === "yearDesc") return b.year - a.year;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPublications.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPubs = sortedPublications.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Download CSV
  const downloadCSV = () => {
    const headers = ["Title", "Authors", "Year", "Citations", "Link"];
    const rows = sortedPublications.map((pub) => [
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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Research Publications by ${author.name}`, 14, 16);

    let y = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const maxLineWidth = pageWidth - margin * 2;

    sortedPublications.forEach((pub, idx) => {
      const wrappedTitle = doc.splitTextToSize(`${idx + 1}. ${pub.title}`, maxLineWidth);
      doc.text(wrappedTitle, margin, y);
      y += wrappedTitle.length * 6;

      const wrappedAuthors = doc.splitTextToSize(`   Authors: ${pub.authors}`, maxLineWidth);
      doc.text(wrappedAuthors, margin, y);
      y += wrappedAuthors.length * 6;

      doc.text(`   Year: ${pub.year} | Citations: ${pub.citation_count}`, margin, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("publications.pdf");
  };

  const handleDownload = () => {
    if (downloadFormat === "csv") downloadCSV();
    else if (downloadFormat === "pdf") downloadPDF();
  };

  return (
    <div className="author-publication-container">
      <h2>📚 Publications by {author.name}</h2>
      <p>Scholar ID: {author.authorId}</p>
      <p>Affiliation: {author.affiliation}</p>
      <p>Total Publications: {publications.length}</p>
      <p style={{ marginBottom: "30px" }}>
        <b>Showing: {sortedPublications.length} results</b>
      </p>

      {/* Filters */}
      <div className="publication-filters">
        <input
          type="text"
          placeholder="Search by title or authors..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="publication-search"
        />
        <input
          type="number"
          placeholder="From Year"
          value={fromYear}
          onChange={(e) => { setFromYear(e.target.value); setCurrentPage(1); }}
          className="publication-year"
        />
        <input
          type="number"
          placeholder="To Year"
          value={toYear}
          onChange={(e) => { setToYear(e.target.value); setCurrentPage(1); }}
          className="publication-year"
        />
        <select
          value={sortOption}
          onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
          style={{
            padding: "4px 10px",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginLeft: "5px",
            marginBottom: "14px",
            cursor: "pointer",
            backgroundColor: "#fff",
            color: "#333",
          }}
        >
          <option value="">Sort by</option>
          <option value="yearAsc">Year ↑</option>
          <option value="yearDesc">Year ↓</option>
        </select>
      </div>

      {/* Publication List */}
      {currentPubs.length === 0 ? (
        <p>No publications found.</p>
      ) : (
        <ul className="publication-list">
          {currentPubs.map((pub) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          className="pagination-controls"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            gap: "10px",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: currentPage === 1 ? "#ccc" : "#4c53afff",
              color: currentPage === 1 ? "#666" : "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: "14px", fontWeight: "500" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: currentPage === totalPages ? "#ccc" : "#4c53afff",
              color: currentPage === totalPages ? "#666" : "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Next →
          </button>
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
            background: "#fff",
            color: "black",
            border: "none",
            borderRadius: "5px"
          }}
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </select>
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          ⬇ Download
        </button>
      </div>
    </div>
  );
};

export default AuthorPublicationsPage;
