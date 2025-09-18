import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";

// Pages & Components
import Navbar from "./components/Navbar";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MyProfilePage from "./pages/MyProfilePage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import RecentPapers from "./pages/RecentPapers";
import MyAccountPage from './pages/MyAccountPage';
import './App.css';
import HeaderSearch from "./pages/HearderSearch";
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

     
    <div className="header-container">
      <h1 className="header-title">
        <span className="highlight">ISTA</span> PAPION
      </h1>
    </div>


      {/* Conditional search bar */}
      <HeaderSearch/>
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
