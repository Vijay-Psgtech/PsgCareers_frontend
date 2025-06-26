import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function PSGHeader() {
  const [psgScrolled, setPsgScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setPsgScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Careers", path: "/careers" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Account", path: "/my-account" },
  ];

  return (
    <header
      className={`psg-header fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${
        psgScrolled
          ? "psg-bg-white psg-backdrop-blur psg-shadow"
          : "psg-bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-1 h-23  flex justify-between items-center">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/Logo2.png"
            alt="PSG Logo"
            className={`w-30 h-auto object-contain transition-transform ${
              psgScrolled ? "scale-100" : "scale-110"
            }`}
            draggable={false}
          />
          <span
            className={`text-3xl font-bold font-playfair transition-colors ${
              psgScrolled ? "text-indigo-900" : "text-blue-700"
            }`}
          >
            PSG Careers
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-12 items-center">
          {navLinks.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className="text-lg font-medium hover:text-indigo-600 transition duration-300"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-blue-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ zIndex: 49 }}
      >
        <nav className="flex flex-col px-6 py-3 space-y-3 text-blue-900 font-medium">
          {navLinks.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className="hover:text-indigo-600 transition"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Styles scoped to this component */}
      <style>{`
        .psg-header {
          --bg-transparent: transparent;
          --bg-white: rgba(255, 255, 255, 0.95);
          --shadow-color: rgba(0, 0, 0, 0.1);
        }
        .psg-bg-transparent {
          background-color: var(--bg-transparent);
        }
        .psg-bg-white {
          background-color: var(--bg-white);
        }
        .psg-backdrop-blur {
          backdrop-filter: saturate(180%) blur(12px);
          -webkit-backdrop-filter: saturate(180%) blur(12px);
        }
        .psg-shadow {
          box-shadow: 0 2px 10px var(--shadow-color);
        }
      `}</style>
    </header>
  );
}