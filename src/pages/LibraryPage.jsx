import React, { useState } from 'react';
import { useAppContext } from "../context/AppContext";
import "../css/LibraryPage.css"; // ✅ import CSS file

const LibraryPage = () => {
  const { papers, setPapers } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (indexToRemove) => {
    const updatedPapers = papers.filter((_, i) => i !== indexToRemove);
    setPapers(updatedPapers);
  };

  // 🔍 Filter papers
  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="library-container">
      <div className="library-card">
        <h2 className="library-title">📚 My Library</h2>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search by title or abstract..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {/* ❌ No papers */}
        {filteredPapers.length === 0 ? (
          <p className="no-papers">No matching papers found.</p>
        ) : (
          <ul className="paper-list">
            {filteredPapers.map((paper, index) => (
              <li key={index} className="paper-item">
                <h3 className="paper-title">{paper.title}</h3>
                <p className="paper-abstract">
                  <strong>📝 Abstract:</strong> {paper.abstract}
                </p>
                <p className="paper-meta">
                  <strong>📎 File:</strong> {paper.fileName} <br />
                  <strong>🕒 Uploaded:</strong>{" "}
                  {new Date(paper.uploadedAt).toLocaleString()}
                </p>

                {/* 🔘 Buttons */}
                <button
                   className='download-btn' style={{padding:"9px",margin:"20px"}}
                   onClick={() => {
                      const link = document.createElement("a");
                      link.href = paper.fileUrl;        // blob/file URL
                      link.download = paper.fileName;   // suggest filename
                      link.click();
                      }}
                     >
                        Download
                  </button>
               <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(index)}
                  >
                      Delete
                  </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
