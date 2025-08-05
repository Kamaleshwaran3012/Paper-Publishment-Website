import React, { useState } from 'react';
import { useAppContext } from "../context/AppContext";

const MyProfilePage = () => {
  const { user, papers, setPapers } = useAppContext(); // ✅
  const [paperTitle, setPaperTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [file, setFile] = useState(null);

  const addPaper = (newPaper) => {
    setPapers([...papers, newPaper]); // ✅ adds to global state
  };

  const handleUpload = (e) => {
  e.preventDefault();
  if (paperTitle.trim() && abstract.trim() && file) {
    const newPaper = {
      title: paperTitle,
      abstract,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file), // ✅ Add file URL
      uploadedAt: new Date().toISOString(),
    };
    setPapers([...papers, newPaper]); // ✅ Save to context
    alert(`Uploaded "${paperTitle}" successfully!`);
    setPaperTitle('');
    setAbstract('');
    setFile(null);
  } else {
    alert('Please fill in all fields.');
  }
};


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Welcome, {user?.name || 'User'}</h2>
      <p className="mb-6 text-gray-600">Upload your research paper below:</p>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Paper Title"
          value={paperTitle}
          onChange={(e) => setPaperTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 mb-4 border rounded"
          placeholder="Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Upload Paper
        </button>
      </form>
    </div>
  );
};

export default MyProfilePage;
