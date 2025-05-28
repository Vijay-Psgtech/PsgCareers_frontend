import React from "react";
import { Outlet } from "react-router-dom";
import ProfileDropdown from "../Users/ProfileDropdown";
import logo from "../../assets/images/logo.png"

// If you're using the public folder, the image should be placed in `public/PSG.png`
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-400/90 backdrop-blur shadow-md border-b border-b-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="PSG Logo" className="h-11 w-12" />
            <span className="text-2xl font-semibold text-indigo-700 tracking-tight">
              PSG Careers
            </span>
          </div>

          {/* Profile */}
          <ProfileDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}