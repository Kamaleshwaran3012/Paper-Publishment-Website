import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    else localStorage.removeItem("user");
  };

  return (
    <AppContext.Provider value={{ user, setUser: saveUser, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
