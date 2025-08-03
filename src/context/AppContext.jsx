import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState([]);

  const addPaper = (paper) => setLibrary(prev => [...prev, paper]);

  return (
    <AppContext.Provider value={{ user, setUser, library, addPaper }}>
      {children}
    </AppContext.Provider>
  );
};
