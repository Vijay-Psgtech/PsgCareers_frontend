import React, { useState,useEffect } from "react";
import logo from '../assets/images/logo.png'
import { useAuth } from "../Context/AuthContext";
import { useNavigate,Link,useLocation} from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FiLogOut,FiMenu,FiX } from "react-icons/fi";
import useAutoLogout from "../hooks/useAutoLogout";

export default function AdminDashboardLayout({children}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const {auth,logout} = useAuth();
    const navigate = useNavigate();
    const allMenus = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Jobs Lists', path: '/admin/jobs-list' },
        { name: 'Add Job posting', path: '/admin/create-jobs' },
        { name: 'Admin Users Lists', path: '/admin/userLists'},
        { name: 'Profile', path: '/admin/profile'},
        
    ];
    const menus = auth.role === 'superadmin' ? allMenus : allMenus.filter(menu=>
       ['Dashboard', 'Profile'].includes(menu.name)
    );
    useEffect(()=>{
        if(auth.role === 'user')
        {
            toast.error('Access Denied');
            navigate('/careers');
        }
    },[navigate])
    if (auth?.token) {
        useAutoLogout(15 * 60 * 1000); // 15 mins
    }
    return(
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-600 text-white transition-all duration-300`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className={`${sidebarOpen ? 'text-xl' : 'hidden'} font-bold uppercase`}>{auth.role}</h1>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
                
                {/* Menu links */}
                <nav className="flex flex-col p-4 gap-2">
                {menus.map((menu, idx) => (
                    <Link
                        key={idx}
                        to={menu.path}
                        className={`flex items-center gap-3 p-2 rounded-md hover:bg-blue-500 ${
                            location.pathname === menu.path ? 'bg-blue-500' : ''
                        }`}
                    >
                        <span className={`${sidebarOpen ? 'capitalize' : 'hidden'} font-bold`}>{menu.name}</span>
                    </Link>
                ))}
                </nav>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between bg-white p-4 shadow-md">
                    <div onClick={()=>navigate('/admin/dashboard')} className="inline-flex gap-4 hover:cursor-pointer">
                        <img src={logo} className="w-10 h-10 rounded"/>
                        <p className="text-lg font-semibold text-blue-900 mt-2">PSG Careers</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaUser className="text-gray-600 cursor-pointer" onClick={()=>navigate('/admin/profile')}/>
                        <span className='text-blue-700'>{auth.name}</span>
                        <button onClick={()=>{logout();navigate('/login');}} className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                            <FiLogOut size={18} />
                            <span className="hidden md:block" >Logout</span>
                        </button>
                    </div>
                </div>
                {/* Page Content */}
                <div className="flex-1 p-6">{children}</div>
            </div>
        </div>
        
    )
}