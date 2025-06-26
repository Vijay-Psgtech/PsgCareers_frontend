import React from "react";
import { Link } from "react-router-dom";

export default function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-transparent text-white font-sans backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        
        {/* ✅ Logo and Title Block - Logo Left Always */}
        <div className="flex items-center gap-3 w-full">
          <Link to="/" className="shrink-0">
            <img
              src="/Logo2.png"
              alt="PSG Logo"
              className="h-14 sm:h-20 drop-shadow-xl transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <div className="flex flex-col justify-center sm:block">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-500 drop-shadow-md">
              PSG Careers
            </h1>
            <p className="text-sm sm:text-base italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 animate-[pulse_3s_ease-in-out_infinite]">
              Start your career on the right path
            </p>
          </div>
        </div>

        {/* Optional Right Side (login button, etc.) */}
        <div className="hidden sm:block">
          {/* <Link
            to="/login"
            className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-blue-700 hover:text-white transition duration-300"
          >
            Login
          </Link> */}
        </div>
      </div>
    </header>
  );
}
