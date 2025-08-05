import React from 'react';
import { useAppContext } from "../context/AppContext";

const LibraryPage = () => {
  const { papers, setPapers } = useAppContext();

  const handleDelete = (indexToRemove) => {
    const updatedPapers = papers.filter((_, i) => i !== indexToRemove);
    setPapers(updatedPapers);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Library</h2>

      {papers.length === 0 ? (
        <p className="text-gray-500">No papers uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {papers.map((paper, index) => (
            <li
              key={index}
              className="border border-gray-200 rounded p-4 shadow-sm bg-white"
            >
              <h3 className="text-lg font-bold text-blue-600">{paper.title}</h3>
              <p className="text-gray-700 mb-2">
                <strong>Abstract:</strong> {paper.abstract}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <strong>File:</strong> {paper.fileName} <br />
                <strong>Uploaded:</strong>{" "}
                {new Date(paper.uploadedAt).toLocaleString()}
              </p>

              <div className="flex gap-4 mt-2">
                {/* ✅ REAL download */}
                <a
                  href={paper.fileUrl}
                  download={paper.fileName}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Download
                </a>

                {/* 🗑️ Delete */}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(index)}
                >
                  Delete
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
