import React from "react";
import { Link } from "react-router-dom";

export default function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md text-white font-sans border-b border-white/10 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 w-full">
          <Link to="/" className="shrink-0">
            <img
              src="/Logo2.png"
              alt="PSG Logo"
              className="h-14 sm:h-20 drop-shadow-xl transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-500 drop-shadow-sm">
              PSG Institutions
            </h1>
            <p className="text-sm sm:text-base italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 animate-pulse">
              Start your career on the right path
            </p>
          </div>
        </div>


        {/* Future Right Side Content */}
        <div className="hidden sm:flex items-center space-x-4">
          {/* Future: Add login/register/profile icon here */}
        </div>
      </div>
    </header>
  );
}
