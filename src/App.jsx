import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";

// Pages & Components
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import AuthorSearchBar from "./components/AuthorSearchBar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MyProfilePage from "./pages/MyProfilePage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import RecentPapers from "./pages/RecentPapers";
import MyAccountPage from './pages/MyAccountPage';

// ✅ Route protection wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useAppContext();
  return user ? children : <Navigate to="/login" />;
};

const Layout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Conditional Hero/Header */}
      {!isProfilePage && (
        <div className="p-4 shadow flex items-center justify-center bg-gray-50">
          <h1 className="text-2xl font-bold text-center">
            <span className="text-blue-600">ISTA</span> PAPION
          </h1>
        </div>
      )}

      {/* Conditional search bar */}
      <div className="px-4 mt-2">
        {isProfilePage ? <AuthorSearchBar /> : <SearchBar />}
      </div>

      {/* Page content */}
      <div className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<RecentPapers />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/my-profile"
            element={
              <PrivateRoute>
                <MyProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <LibraryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <MyAccountPage />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

// Wrap app with context provider
const App = () => (
  <AppProvider>
    <Layout />
  </AppProvider>
);

export default App;
