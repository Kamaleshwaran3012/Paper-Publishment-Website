import React from "react";
import { Link } from "react-router-dom";
import "../css/HomePage.css"; // import the CSS file

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Research Hub</h1>
        <p>Discover cutting-edge research papers, explore top authors, and stay updated with the latest academic trends.</p>
        <Link to="/library" className="btn-primary">Explore Library</Link>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Extensive Library</h3>
            <p>Access thousands of research papers across multiple domains, all in one place.</p>
          </div>
          <div className="feature-card">
            <h3>Top Authors</h3>
            <p>Discover top researchers and their publications to stay updated with innovations.</p>
          </div>
          <div className="feature-card">
            <h3>Advanced Search</h3>
            <p>Easily filter papers by title, author, date, or category with powerful search tools.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta">
        <h2>Start Your Research Journey Today</h2>
        <p>Join our community of researchers, explore papers, and contribute to knowledge.</p>
        <Link to="/author" className="btn-primary">Explore Authors</Link>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About Research Hub</h2>
        <p>
          Research Hub is a platform designed for academics, students, and professionals
          to access high-quality research papers and connect with top authors. Stay updated, stay informed, and grow your knowledge with our curated resources.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Research Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
