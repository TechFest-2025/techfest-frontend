import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger and close icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-purple-700 text-white px-4 py-3 shadow-md ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - Hamburger on small screens */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Center or hidden brand on mobile */}
        <div className="hidden md:block font-bold text-xl tracking-wide">
          Techfest
        </div>

        {/* Right - Techfest logo on mobile only */}
        <div className="md:hidden font-bold text-xl tracking-wide ml-auto">
          Techfest
        </div>

        {/* Menu Items */}
        <div
          className={`absolute top-16 left-0 w-full bg-purple-700 text-white z-10 flex flex-col items-start px-4 py-3 space-y-2 transition-transform md:static md:flex-row md:items-center md:space-x-6 md:space-y-0 md:top-0 md:left-0 md:w-auto ${
            isOpen ? "block" : "hidden md:flex"
          }`}
        >
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link to="/events" className="hover:text-gray-200">
            Events
          </Link>
          <Link to="/register" className="hover:text-gray-200">
            Register
          </Link>
          <Link to="/admin" className="hover:text-gray-200">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
