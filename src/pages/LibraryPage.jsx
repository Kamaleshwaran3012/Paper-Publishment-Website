import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const LibraryPage = () => {
  const { library } = useContext(AppContext);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Library</h2>
      <ul>
        {library.map((paper, index) => (
          <li key={index} className="mb-2 border-b pb-1">{paper.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default LibraryPage;
