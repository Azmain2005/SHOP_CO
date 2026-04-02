"use client";

import React, { useState } from 'react';
import { Menu, X, Globe, MessageSquare, User, LogOut, Bell, MoreVertical, HardDrive } from 'lucide-react'; // Added MoreVertical and HardDrive icons
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';



export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();


  const handleLogout = (e) => {
    if (e) e.preventDefault(); // Prevents the "#" from jumping to the top of the page

    localStorage.removeItem('auth_token');
    Cookies.remove('auth_token');

    router.push('/account/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">

        {/* LEFT SIDE: Mobile Menu Toggle / Logo / Clear Cache */}
        <div className="flex items-center space-x-3">
          {/* Menu Icon (3 bars) - Show on small screens */}


          {/* Logo/Brand - Hidden on xs/sm screen when menu is open to match compact look */}
          <div className={`text-2xl font-bold ${isMobileMenuOpen ? 'hidden sm:block' : 'block'}`}>
            <span className="text-black">SHOP</span>.<span className="text-gray-600">CO</span>
          </div>

        </div>

        {/* RIGHT SIDE: Mobile & Desktop Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">

          {/* Mobile Layout: Language & Message Icon (Visible on small screens) */}
          <div className="md:hidden flex items-center space-x-3">
          </div>


          {/* Desktop Layout: User Icons (Visible on medium and larger screens) */}
          <div className="hidden md:flex items-center space-x-6">


            {/* Message (1) (Desktop) */}
            <a href="#" className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
              <MessageSquare className="w-5 h-5 mr-1" />
              <span>Message (1)</span>
            </a>


            {/* Profile (Desktop) */}
            <a href="#" className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
              <User className="w-5 h-5 mr-1" />
              <span>Profile</span>
            </a>

            {/* Logout (Desktop) */}
            <a
              href="#"
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 text-sm transition-colors"
            >
              <LogOut className="w-5 h-5 mr-1" />
              <span>Logout</span>
            </a>
          </div>

        </div>
      </div>


    </nav>
  );
}