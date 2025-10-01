"use client";
import { useState } from "react";
import Link from "next/link";
// Using icons from a single, standard package (like lucide-react or feather) usually looks cleaner,
// but sticking with react-icons as requested.
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // Increased max-width for a more expansive feel, added a subtle border for separation.
    <nav className="max-w-[1500px] mx-auto bg-white border-b border-gray-100/70 py-[1px]">
      <div className="px-6 lg:px-12 flex items-center justify-between py-4 md:py-5">
        
        {/* Left: Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            className="text-3xl text-gray-800 hover:text-black transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Center: Logo - Cooler Font and Color */}
        <Link
          href="/"
          // Bolder, slightly more stylized font size for a statement logo.
          className="lg:text-[48px] max-sm:text-[34px] font-black tracking-tight text-gray-900 mx-auto md:mx-0"
        >
          <span className="text-black">SHOP</span>.<span className="text-gray-600">CO</span>
        </Link>

        {/* Desktop Menu - Tighter Spacing, Bolder Text */}
        <div className="hidden md:flex items-center space-x-8 ml-8">
          {/* Enhanced Shop Link with dropdown indicator */}
          <Link href="/product" className="group flex items-center text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-black transition-colors relative">
            Shop 
            <span className="ml-1 text-xs group-hover:text-gray-600 transition-colors">▼</span>
            {/* Subtle underline hover effect */}
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link href="/sale" className="text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-black transition-colors">
            On Sale
          </Link>
          <Link href="/new-arrivals" className="text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-black transition-colors">
            New Arrivals
          </Link>
          <Link href="/brands" className="text-sm font-semibold uppercase tracking-wider text-gray-700 hover:text-black transition-colors">
            Brands
          </Link>
        </div>

        {/* Desktop Search Bar - Sleeker Design */}
        {/* Removed fixed 'w-[1077px]' and kept 'max-w-xl' for better flexibility */}
        <div className="hidden md:flex flex-1 mx-8 max-w-lg lg:max-w-xl">
          <div className="flex w-full items-center rounded-full bg-gray-50 border border-gray-200 px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-gray-300 transition-all">
            <FiSearch className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="ml-3 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right: Icons - Bigger and Bolder */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          <FiSearch className="text-2xl text-gray-800 cursor-pointer hover:text-black md:hidden transition-colors" />
          
          <Link href="/cart" className="relative group">
             {/* Slightly larger, use a group hover for effect */}
            <FiShoppingCart className="text-2xl text-gray-800 cursor-pointer group-hover:text-gray-600 transition-colors" />
            {/* Optional: Add a subtle badge/dot if cart has items */}
            {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span> */}
          </Link>

          <Link href="/account" className="group">
            <FiUser className="text-2xl text-gray-800 cursor-pointer group-hover:text-gray-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu - Clean, padded look */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-4 border-t border-gray-100/70 bg-white shadow-lg">
          {/* Search Bar inside dropdown */}
          <div className="flex w-full items-center rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
            <FiSearch className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Search for products..."
              className="ml-3 flex-1 bg-transparent outline-none text-base placeholder-gray-400"
            />
          </div>
          <Link href="/product" className="block py-2 text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors">
            Shop
          </Link>
          <Link href="/sale" className="block py-2 text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors">
            On Sale
          </Link>
          <Link href="/new-arrivals" className="block py-2 text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors">
            New Arrivals
          </Link>
          <Link href="/brands" className="block py-2 text-lg font-medium text-gray-800 hover:text-gray-600 transition-colors">
            Brands
          </Link>
        </div>
      )}
    </nav>
  );
}