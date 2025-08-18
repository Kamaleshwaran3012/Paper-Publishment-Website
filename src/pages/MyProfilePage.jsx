import React, { useState } from 'react';
import { useAppContext } from "../context/AppContext";

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
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-2">👋 Hello, {user?.name || 'User'}</h2>
      <p className="mb-6 text-gray-600">Submit your latest research paper below:</p>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Paper Title"
          value={paperTitle}
          onChange={(e) => setPaperTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Abstract"
          rows={4}
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
        <input
          type="file"
          className="w-full"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        {file && <p className="text-sm text-green-600">📄 {file.name}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          🚀 Upload Paper
        </button>
      </form>
    </div>
  );
};

export default MyProfilePage;
