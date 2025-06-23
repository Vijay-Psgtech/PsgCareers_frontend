import React from "react";
import { Outlet } from "react-router-dom";
import ProfileDropdown from "../Users/ProfileDropdown";
import logo from "../../assets/images/logo.png";
import Footer from "../Footer"; // Adjust path if Footer is in a different location

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-400/90 backdrop-blur shadow-md border-b border-b-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="PSG Logo" className="h-11 w-12" />
            <span className="text-2xl font-semibold text-indigo-700 tracking-tight">
              PSG Careers
            </span>
          </div>

          {/* User Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}