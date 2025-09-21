import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ id: 1, name: "Alice" }); // Example logged-in user
  const [papers, setPapers] = useState([]);

  return (
    <AppContext.Provider value={{ user, setUser, papers, setPapers }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
