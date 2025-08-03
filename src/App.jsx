// App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Pages & Components
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import AuthorSearchBar from "./components/AuthorSearchBar";
import SignupPage from "./pages/SignupPage";
import MyProfilePage from "./pages/MyProfilePage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import RecentPapers from "./pages/RecentPapers";

const Layout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Title Bar */}
      {!isProfilePage && (
        <div className="p-4 shadow flex items-center justify-center">
          <h1 className="text-2xl font-semibold">
            <span className="text-blue-600">ISTA</span> PAPION
          </h1>
        </div>
      )}

      {/* Conditional Search Bar */}
      <div className="px-4 mt-2">
        {isProfilePage ? <AuthorSearchBar /> : <SearchBar />}
      </div>

      {/* Main Pages */}
      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<RecentPapers />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <Router>
      <Layout />
    </Router>
  </AppProvider>
);

export default App;
