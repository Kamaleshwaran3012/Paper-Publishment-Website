import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProfilePage.css";

const ProfilePage = () => {
  const { user, loading } = useAppContext();
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  // redirect once we know loading is done
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
useEffect(() => {
  console.log(user); // <-- add this
}, [user]);

  // fetch publications only if user exists
  useEffect(() => {
    const fetchAndStore = async () => {
      if (user?.authorId) {
        try {
          await axios.post(
            `http://localhost:5000/api/fetch-publications/${user.authorId}`
          );
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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>👤 Welcome, {user.name}</h2>
        <p><b>Google Scholar ID:</b> {user.authorId}</p>
        <p><b>Affiliation: </b>{user.affiliation}</p>
      </div>

      <div className="papers-section">
        <h3>📄 Your Publications</h3>
        {publications.length === 0 ? (
          <p>No publications found.</p>
        ) : (
          <ul>
            {publications.map((pub) => (
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
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
