import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PSGHeader() {
  const [psgScrolled, setPsgScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setPsgScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`psg-header fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        psgScrolled
          ? "psg-bg-white psg-backdrop-blur psg-shadow"
          : "psg-bg-transparent"
      }`}
    >
      <div className="psg-container max-w-7xl mx-auto px-8 sm:px-12 py-4 flex justify-between items-center">
        {/* Logo + Title */}
        <Link to="/" className="psg-logo flex items-center space-x-1" style={{ textDecoration: "none" }}>
          <img        
            src="/logo.png"
            alt="PSG Logo"
            className={`psg-logo-img w-24 h-13 object-cover transition-transform ${
              psgScrolled ? "scale-100" : "scale-110"
            }`}
            draggable={false}
          />
          <span
            className={`psg-title text-2xl font-playfair font-bold transition-colors ${
              psgScrolled ? "text-indigo-900" : "text-blue-700"
            }`}
            style={{ textDecoration: "none" }}
          >
            PSG Careers
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="psg-nav hidden md:flex space-x-12">
          {["Home", "Careers", "Dashboard", "My Account"].map((label) => {
            const path =
              label === "Home"
                ? "/"
                : label === "Careers"
                ? "/careers"
                : label === "Dashboard"
                ? "/dashboard"
                : "/my-account";

            return (
              <Link
                key={label}
                to={path}
                className={`psg-nav-link font-lora text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                style={{ textDecoration: "none" }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <style>{`
        .psg-header {
          --bg-transparent: transparent;
          --bg-white: rgba(255 255 255 / 0.9);
          --shadow-color: rgba(0, 0, 0, 0.1);
        }
        .psg-bg-transparent {
          background-color: var(--bg-transparent);
        }
        .psg-bg-white {
          background-color: var(--bg-white);
        }
        .psg-backdrop-blur {
          backdrop-filter: saturate(180%) blur(15px);
          -webkit-backdrop-filter: saturate(180%) blur(15px);
        }
        .psg-shadow {
          box-shadow: 0 2px 10px var(--shadow-color);
        }
        .psg-nav-link {
          text-decoration: none;
          color: inherit;
        }
        .psg-nav-link:hover {
          text-decoration: none;
          color: #4c51bf;
        }
        .psg-logo,
        .psg-title {
          text-decoration: none;
        }
        .psg-logo-img {
          user-select: none;
          -webkit-user-drag: none;
        }
      `}</style>
    </header>
  );
}