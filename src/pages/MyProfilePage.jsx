import React, { useState } from 'react';
import { useAppContext } from "../context/AppContext";
import "../css/MyProfilePage.css"; // import CSS

const MyProfilePage = () => {
  const { user, papers, setPapers } = useAppContext();
  const [paperTitle, setPaperTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();

    if (paperTitle.trim() && abstract.trim() && file) {
      const newPaper = {
        title: paperTitle,
        abstract,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      };
      setPapers([...papers, newPaper]);
      alert(`✅ "${paperTitle}" uploaded successfully.`);
      setPaperTitle('');
      setAbstract('');
      setFile(null);
    } else {
      alert('⚠️ Please fill in all fields.');
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
