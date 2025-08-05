import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ✅ Load user only if not logged out this session
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedOut = sessionStorage.getItem("loggedOut") === "true";

    return (!isLoggedOut && storedUser) ? JSON.parse(storedUser) : null;
  });

  const [papers, setPapers] = useState(() => {
    const storedPapers = localStorage.getItem("papers");
    return storedPapers ? JSON.parse(storedPapers) : [];
  });

  // ✅ Persist paper list across sessions
  useEffect(() => {
    localStorage.setItem("papers", JSON.stringify(papers));
  }, [papers]);

  // ✅ Persist user info on login/signup
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("loggedOut"); // Clear logout flag
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, papers, setPapers }}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ Export only the hook
export const useAppContext = () => useContext(AppContext);
