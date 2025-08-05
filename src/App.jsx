import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import MyAccountPage from './pages/MyAccountPage';

const Layout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {!isProfilePage && (
        <div className="p-4 shadow flex items-center justify-center">
          <h1 className="text-2xl font-semibold">
            <span className="text-blue-600">ISTA</span> PAPION
          </h1>
        </div>
      )}
      <div className="px-4 mt-2">
        {isProfilePage ? <AuthorSearchBar /> : <SearchBar />}
      </div>
      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<RecentPapers />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/account" element={<MyAccountPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <Layout /> {/* ✅ NO <Router> here */}
  </AppProvider>
);

export default App;
