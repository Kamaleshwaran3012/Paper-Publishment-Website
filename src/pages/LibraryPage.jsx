import React, { useState } from 'react';
import { useAppContext } from "../context/AppContext";

const LibraryPage = () => {
  const { papers, setPapers } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (indexToRemove) => {
    const updatedPapers = papers.filter((_, i) => i !== indexToRemove);
    setPapers(updatedPapers);
  };

  // 🔍 Filter papers based on search query (title or abstract)
  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow rounded">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        📚 My Library
      </h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search by title or abstract..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-6 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />

      {/* ❌ No papers */}
      {filteredPapers.length === 0 ? (
        <p className="text-gray-500 text-center">No matching papers found.</p>
      ) : (
        <ul className="space-y-6">
          {filteredPapers.map((paper, index) => (
            <li
              key={index}
              className="border border-gray-200 rounded p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-blue-700">{paper.title}</h3>
              <p className="text-gray-700 mt-2">
                <strong>📝 Abstract:</strong> {paper.abstract}
              </p>
              <p className="text-gray-600 mt-1 text-sm">
                <strong>📎 File:</strong> {paper.fileName} <br />
                <strong>🕒 Uploaded:</strong>{" "}
                {new Date(paper.uploadedAt).toLocaleString()}
              </p>

              {/* 🔘 Buttons */}
              <div className="flex gap-4 mt-4">
                <a
                  href={paper.fileUrl}
                  download={paper.fileName}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                >
                  ⬇️ Download
                </a>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(index)}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LibraryPage;
