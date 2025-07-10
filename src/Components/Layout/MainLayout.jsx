import React from "react";
import { Outlet } from "react-router-dom";
import ProfileDropdown from "../Users/ProfileDropdown";
// import logo from "../../assets/images/logo.png";
import Footer from "../Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col text-gray-800 bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-400/90 backdrop-blur shadow-md border-b border-blue-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img src="/Logo2.png" alt="PSG Logo" className="h-14 sm:h-20 drop-shadow-xl transition-transform duration-300 hover:scale-105" />
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-indigo-700 tracking-tight whitespace-nowrap">
              PSG Careers
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="w-full sm:w-auto">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200">
        <Footer />
      </footer>
    </div>
  );
}
