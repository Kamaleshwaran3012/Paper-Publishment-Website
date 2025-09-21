import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProfilePage.css"; // custom CSS

const ProfilePage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [myPapers, setMyPapers] = useState([]);

  // 🔹 Redirect to login if user doesn't exist
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 🔹 Fetch user's uploaded papers from backend
  const fetchMyPapers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/my-papers/${user._id}`);
      setMyPapers(res.data);
    } catch (err) {
      console.error("Error fetching papers:", err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchMyPapers();
  }, [user]);

  // 🔹 Handle delete
  const handleDelete = async (paperId) => {
    if (window.confirm("Are you sure you want to delete this paper?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/papers/${paperId}`);
        if (res.status === 200) {
          setMyPapers(myPapers.filter((paper) => paper._id !== paperId));
        }
      } catch (err) {
        console.error("Error deleting paper:", err);
      }
    }
  };

  // Prevent render if no user
  if (!user) return null;

  return (
    <div className="profile-container">
      {/* 🔹 User Info & Upload Button */}
      <div className="profile-header">
        <h2 className="profile-title">👤 Welcome, {user.name}</h2>
        <p className="profile-email">Email: <span>{user.email}</span></p>

        <button
          onClick={() => navigate("/my-profile")}
          className="upload-btn"
        >
          ➕ Upload New Paper
        </button>
      </div>

      {/* 🔹 Uploaded Papers Section */}
      <div className="papers-section">
        <h3 className="papers-title">📄 Your Uploaded Papers</h3>

        {myPapers.length === 0 ? (
          <p className="no-papers">You haven’t uploaded any papers yet.</p>
        ) : (
          <ul className="papers-list">
            {myPapers.map((paper) => (
              <li key={paper._id} className="paper-card">
                <h4 className="paper-title">{paper.title}</h4>
                <p className="paper-abstract"><strong>📝 Abstract:</strong> {paper.abstract}</p>
                <p className="paper-meta">
                  <strong>📎 File:</strong> {paper.fileName} <br />
                  <strong>🕒 Uploaded:</strong> {new Date(paper.uploadedAt).toLocaleString()}
                </p>
                <div className="paper-actions">
                  <a
                    href={paper.fileUrl}
                    download={paper.fileName}
                    className="download-btn"
                  >
                    ⬇️ Download
                  </a>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(paper._id)}
                  >
                    🗑 Delete
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
