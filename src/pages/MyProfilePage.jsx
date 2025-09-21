import React, { useState, useEffect } from 'react';
import { useAppContext } from "../context/AppContext";
import "../css/MyProfilePage.css";
import axios from "axios";

const MyProfilePage = () => {
  const { user } = useAppContext(); // logged-in user
  const [paperTitle, setPaperTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState(null);
  const [myPapers, setMyPapers] = useState([]); // fetched from backend
  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!paperTitle.trim() || !abstract.trim() || !file) {
      alert('⚠️ Please fill in all fields.');
      return;
    }

    try {
      // In real apps, use FormData for file upload
      // Here we send only file metadata (for simplicity)
      const newPaper = {
        userId: user._id,
        title: paperTitle,
        abstract,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file) // temporary URL for preview
      };

      const res = await axios.post("http://localhost:5000/upload", newPaper);

      alert(`✅ "${paperTitle}" uploaded successfully.`);

      // Update myPapers list
      setMyPapers([...myPapers, res.data.paper]);

      // Reset form
      setPaperTitle('');
      setAbstract('');
      setFile(null);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to upload paper.');
    }
  };

  return (
    <div className="profile-form-container">
      <h2 className="profile-form-title">👋 Hello, {user?.name || 'User'}</h2>
      <p className="profile-form-subtitle">Submit your latest research paper below:</p>

      <form onSubmit={handleUpload} className="profile-form">
        <input
          type="text"
          className="input-field"
          placeholder="Paper Title"
          value={paperTitle}
          onChange={(e) => setPaperTitle(e.target.value)}
          required
        />
        <textarea
          className="textarea-field"
          placeholder="Abstract"
          rows={4}
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        {file && <p className="file-name">📄 {file.name}</p>}

        <button type="submit" className="upload-button">
          🚀 Upload Paper
        </button>
      </form>
    </div>
  );
};

export default MyProfilePage;
