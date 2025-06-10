import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User, Settings, LayoutDashboard, Briefcase } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";


export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
      >
        My Profile
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-60 bg-white rounded-xl shadow-lg ring-1 ring-gray-200">
          <div className="py-2 text-sm text-gray-800">
            <DropdownLink to="/profile" icon={<User className="w-4 h-4 text-indigo-600" />}>
              View & Update Profile
            </DropdownLink>
            <DropdownLink to="/account" icon={<Settings className="w-4 h-4 text-green-600" />}>
              My Account
            </DropdownLink>
            <DropdownLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4 text-orange-500" />}>
              Dashboard
            </DropdownLink>
            <DropdownLink to="/careers" icon={<Briefcase className="w-4 h-4 text-blue-600" />}>
              Apply Jobs
            </DropdownLink>
            <div className="border-t border-gray-100 my-2" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({ to, icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-gray-700"
    >
      {icon}
      {children}
    </Link>
  );
}
