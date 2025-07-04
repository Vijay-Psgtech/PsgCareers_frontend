import React, { useState, useEffect } from "react";
import logo from '../assets/images/logo.png';
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import useAutoLogout from "../hooks/useAutoLogout";
import { toast } from "react-toastify";

export default function AdminDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const allMenus = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Jobs Lists', path: '/admin/jobs-list' },
    { name: 'Add Job posting', path: '/admin/create-jobs' },
    { name: 'Admin Users Lists', path: '/admin/userLists' },
    { name: 'Profile', path: '/admin/profile' },
  ];

  const menus = auth.role === 'superadmin'
    ? allMenus
    : allMenus.filter(menu => ['Dashboard', 'Profile'].includes(menu.name));

  useEffect(() => {
    if (auth.role === 'user') {
      toast.error('Access Denied');
      navigate('/careers');
    }
  }, [navigate, auth.role]);

  if (auth?.token) {
    useAutoLogout(15 * 60 * 1000); // 15 minutes
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold uppercase">{auth.role}</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {menus.map((menu, idx) => (
            <Link
              key={idx}
              to={menu.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center p-2 rounded-md hover:bg-blue-500 ${location.pathname === menu.path ? 'bg-blue-500' : ''}`}
            >
              <span className="font-semibold">{menu.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-700" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <div onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-3 cursor-pointer">
              <img src={logo} alt="logo" className="w-10 h-10 rounded" />
              <p className="text-lg font-semibold text-blue-900 hidden sm:block">PSG Careers</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaUser className="text-gray-600 cursor-pointer" onClick={() => navigate('/admin/profile')} />
            <span className="text-blue-700 hidden sm:inline">{auth.name}</span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
            >
              <FiLogOut size={18} />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Page Body */}
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}
