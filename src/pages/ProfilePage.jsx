import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, papers } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-2 text-blue-700">
        👤 Welcome, {user?.name || "Guest"}
      </h2>
      <p className="text-gray-600 mb-6">
        Email: <span className="font-medium">{user?.email}</span>
      </p>

      <button
        onClick={() => navigate("/my-profile")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-6"
      >
        ➕ Upload New Paper
      </button>

      {/* 🔽 Show uploaded papers here */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📄 Your Uploaded Papers</h3>

        {papers.length === 0 ? (
          <p className="text-gray-500">You haven’t uploaded any papers yet.</p>
        ) : (
          <ul className="space-y-4">
            {papers.map((paper, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded p-4 bg-gray-50 shadow-sm"
              >
                <h4 className="text-lg font-semibold text-blue-700">{paper.title}</h4>
                <p className="text-gray-700 mt-1">
                  <strong>📝 Abstract:</strong> {paper.abstract}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>📎 File:</strong> {paper.fileName} <br />
                  <strong>🕒 Uploaded:</strong>{" "}
                  {new Date(paper.uploadedAt).toLocaleString()}
                </p>
                <div className="mt-3">
                  <a
                    href={paper.fileUrl}
                    download={paper.fileName}
                    className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    ⬇️ Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
