import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProfilePage.css";

const PAGE_SIZE = 10; // 20 publications per page

const ProfilePage = () => {
  const { user, loading } = useAppContext();
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchAndStore = async () => {
      if (user?.authorId) {
        try {
          // Fetch & store any new publications
        
          // Get all publications
          const res = await axios.get(
            `http://localhost:5000/api/my-publications/${user.authorId}`
          );
          setPublications(res.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchAndStore();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  // Pagination logic
  const totalPages = Math.ceil(publications.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPubs = publications.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>👤 Welcome, {user.name}</h2>
        <p><b>Google Scholar ID:</b> {user.authorId}</p>
        <p><b>Affiliation:</b> {user.affiliation}</p>
      </div>

      <div className="papers-section">
        <h3>📄 Your Publications</h3>
        {publications.length === 0 ? (
          <p>No publications found.</p>
        ) : (
          <>
            <ul>
              {currentPubs.map((pub) => (
                <li key={pub._id}>
                  <h4>{pub.title}</h4>
                  <p>Authors: {pub.authors}</p>
                  <p>Year: {pub.year}</p>
                  <p>Citations: {pub.citation_count}</p>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🔗 View
                    </a>
                  )}
                </li>
              ))}
            </ul>

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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
