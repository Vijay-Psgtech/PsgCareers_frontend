import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  LightMode,
  DarkMode,
} from "@mui/icons-material";

const institutionInfo = {
  "PSG College of Technology": {
    about: "A premier institution fostering innovation and technical excellence.",
    email: "careers@psgtech.edu",
    phone: "+91 422 257 2477",
    location: "Peelamedu, Coimbatore",
  },
  "PSG Polytechnic College": {
    about: "Empowering future technicians with quality education.",
    email: "careers@psgpoly.ac.in",
    phone: "+91 422 257 2177",
    location: "Peelamedu, Coimbatore",
  },
  "PSG Institute of Management": {
    about: "A center of excellence in business and leadership studies.",
    email: "careers@psgim.ac.in",
    phone: "+91 422 257 7252",
    location: "Peelamedu, Coimbatore",
  },
};

const Footer = ({ institution = "PSG College of Technology" }) => {
  const [darkMode, setDarkMode] = useState(false);
  const info = institutionInfo[institution] || institutionInfo["PSG College of Technology"];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <footer className={`mt-20 transition-all duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">PSG Careers</h2>
          <p className="text-sm leading-relaxed">{info.about}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link></li>
            <li><Link to="/jobs" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">Job Listings</Link></li>
            <li><Link to="/about" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">About PSG</Link></li>
            <li><Link to="/contact" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="font-medium">Email:</span> <a href={`mailto:${info.email}`} className="hover:underline">{info.email}</a></li>
            <li><span className="font-medium">Phone:</span> {info.phone}</li>
            <li><span className="font-medium">Location:</span> {info.location}</li>
          </ul>
        </div>

        {/* Social Media & Theme Toggle */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
          <div className="flex space-x-4 mb-6">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500">
              <Facebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500">
              <Twitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-500">
              <LinkedIn />
            </a>
            <a href={`mailto:${info.email}`} className="hover:text-indigo-500">
              <Email />
            </a>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-700 transition"
          >
            {darkMode ? <LightMode /> : <DarkMode />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={`text-center text-sm py-5 border-t ${darkMode ? "border-indigo-700" : "border-gray-300"}`}>
        © {new Date().getFullYear()} <span className="font-medium">{institution}</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;