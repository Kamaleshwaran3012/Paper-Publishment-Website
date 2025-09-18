import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import "../css/ProfilePage.css"; // custom CSS

const ProfilePage = () => {
  const { user, papers } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <h2 className="profile-title">
        👤 Welcome, {user?.name || "Guest"}
      </h2>
      <p className="profile-email">
        Email: <span>{user?.email}</span>
      </p>

      <button
        onClick={() => navigate("/my-profile")}
        className="upload-btn"
      >
        ➕ Upload New Paper
      </button>

      {/* 🔽 Show uploaded papers here */}
      <div className="papers-section">
        <h3 className="papers-title">📄 Your Uploaded Papers</h3>

        {papers.length === 0 ? (
          <p className="no-papers">You haven’t uploaded any papers yet.</p>
        ) : (
          <ul className="papers-list">
            {papers.map((paper, index) => (
              <li key={index} className="paper-card">
                <h4 className="paper-title">{paper.title}</h4>
                <p className="paper-abstract">
                  <strong>📝 Abstract:</strong> {paper.abstract}
                </p>
                <p className="paper-meta">
                  <strong>📎 File:</strong> {paper.fileName} <br />
                  <strong>🕒 Uploaded:</strong>{" "}
                  {new Date(paper.uploadedAt).toLocaleString()}
                </p>
                <div>
                  <a
                    href={paper.fileUrl}
                    download={paper.fileName}
                    className="download-btn"
                  >
                     Download
                  </a>
                  <button
                    className="btn delete-btn"
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
    </div>
  );
};

export default ProfilePage;
