import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Layout = ({ children, hideFooter = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col bg-black text-white">
      {/* === Navbar === */}
      <header className="flex justify-between items-center px-6 py-4 bg-black/80 backdrop-blur-md shadow-lg border-b border-cyan-500 sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 tracking-wider">
          TECHFEST
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-cyan-400 transition-colors duration-300">
            Home
          </Link>
          <Link to="/events" className="hover:text-fuchsia-400 transition-colors duration-300">
            Events
          </Link>
          <a
            href="/Techfest_Invitation_2025.pdf"
            download
            className="hover:text-purple-400 transition-colors duration-300"
          >
            Invitation
          </a>
          <Link to="/admin" className="hover:text-cyan-400 transition-colors duration-300">
            Admin Login
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-7 h-7 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 text-2xl font-bold z-40 animate-fade-in">
          <button
            className="absolute top-6 right-6 text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-cyan-400 transition-transform hover:scale-110"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMenuOpen(false)}
            className="hover:text-fuchsia-400 transition-transform hover:scale-110"
          >
            Events
          </Link>
          <a
            href="/Techfest_Invitation_2025.pdf"
            download
            onClick={() => setMenuOpen(false)}
            className="hover:text-purple-400 transition-transform hover:scale-110"
          >
            Invitation
          </a>
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="hover:text-cyan-400 transition-transform hover:scale-110"
          >
            Admin Login
          </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow relative z-10">{children}</main>

      {/* === Futuristic Footer === */}
      {!hideFooter && (
        <footer className="bg-black/90 border-t border-cyan-500 py-10 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-gray-300 px-6">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-cyan-400 mb-3 text-lg">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-fuchsia-400">Home</Link></li>
                <li><Link to="/events" className="hover:text-fuchsia-400">Events</Link></li>
                <li><Link to="/register" className="hover:text-fuchsia-400">Register</Link></li>
                <li><a href="/Techfest_Invitation_2025.pdf" download className="hover:text-fuchsia-400">Invitation</a></li>
                <li><Link to="/admin" className="hover:text-fuchsia-400">Admin Login</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-purple-400 mb-3 text-lg">Contact</h4>
              <p className="text-sm leading-relaxed">
                📍 Alagappa Institute of Skill Development,<br />
                Alagappa University, Karaikudi – 630 003, Tamil Nadu, India
              </p>
              <p className="mt-2">📧 <a href="mailto:techfest.au.aisd@gmail.com" className="hover:text-cyan-400">techfest.au.aisd@gmail.com</a></p>
              <p>📞 <a href="tel:+919876543210" className="hover:text-cyan-400">+91 8428239386</a></p>
            </div>

            {/* Student co-ordinator */}
            <div>
              <h4 className="font-bold text-fuchsia-400 mb-3 text-lg"> Student Co-ordinators Number : </h4>
              <div className="flex space-x-4">
                <p>📞 <a href="tel:+916383531918" className="hover:text-cyan-400">+91 9025798836</a></p>  
              </div>
              <div className="flex space-x-4">
                <p>📞 <a href="tel:+919384196289" className="hover:text-cyan-400">+91 9384196289</a></p>  
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TechFest | Alagappa Institute of Skill Development,Alagappa University. All rights reserved.  <a href="https://merchant.razorpay.com/policy/Qun6p6Mn8FwAPw/terms" className="hover:text-cyan-400">Terms and conditions</a>
          </div>
        </footer>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Layout;
