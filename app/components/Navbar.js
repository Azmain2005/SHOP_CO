"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiUser, FiChevronDown, FiX, FiMenu } from "react-icons/fi";

const ABAYA_SUBMENU = [
  { label: "Short Abaya", href: "/product?category=short-abaya" },
  { label: "ABCD Abaya", href: "/product?category=abcd-abaya" },
  { label: "Stone Abaya", href: "/product?category=stone-abaya" },
  { label: "View All Abayas", href: "/product?category=abaya" },
];

const NAV_LINKS = [
  { label: "Collections", href: "/product" },
  { label: "Abaya", href: "#", hasDropdown: true },
  { label: "Kaftan", href: "/product?category=kaftan" },
  { label: "Borka", href: "/product?category=borka" },
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAbayaOpen, setIsAbayaOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-stone-100 sticky top-0 z-[100] h-20">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden text-2xl text-stone-800 p-2"
          >
            <FiMenu />
          </button>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <h1 className="text-xl md:text-2xl font-serif tracking-widest text-stone-900 uppercase">
              InStyle<span className="font-light italic text-stone-500 text-lg">by</span>Shifa
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.label} 
                className="relative group"
                onMouseEnter={() => link.hasDropdown && setIsAbayaOpen(true)}
                onMouseLeave={() => link.hasDropdown && setIsAbayaOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${link.highlight ? "text-[#D4AF37]" : "text-stone-600 hover:text-black"}`}
                >
                  {link.label}
                </Link>

                {link.hasDropdown && isAbayaOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 pt-6 w-48">
                    <div className="bg-white border border-stone-100 shadow-xl py-3 rounded-sm">
                      {ABAYA_SUBMENU.map((item) => (
                        <Link key={item.label} href={item.href} className="block px-6 py-2 text-[9px] uppercase tracking-widest text-stone-500 hover:text-black hover:bg-stone-50">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block"><FiUser className="text-xl text-stone-800" /></Link>
            <Link href="/cart" className="relative p-2">
              <FiShoppingCart className="text-xl text-stone-800" />
              <span className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark semi-transparent background so the hero still "shows" through a bit */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-[2px] md:hidden"
            />
            
            {/* Sidebar Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[120] shadow-2xl md:hidden flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xs font-bold tracking-widest uppercase text-stone-400">Menu</span>
                <button onClick={() => setIsMobileOpen(false)} className="text-2xl"><FiX /></button>
              </div>

              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <div key={link.label}>
                    <div className="flex justify-between items-center group">
                      <Link
                        href={link.href}
                        onClick={() => !link.hasDropdown && setIsMobileOpen(false)}
                        className={`text-xl font-serif ${link.highlight ? "text-[#D4AF37]" : "text-stone-800"}`}
                      >
                        {link.label}
                      </Link>
                      {link.hasDropdown && (
                        <FiChevronDown 
                          className={`transition-transform ${isAbayaOpen ? 'rotate-180' : ''}`} 
                          onClick={() => setIsAbayaOpen(!isAbayaOpen)}
                        />
                      )}
                    </div>
                    
                    {link.hasDropdown && isAbayaOpen && (
                      <div className="mt-4 ml-4 flex flex-col gap-4 border-l border-stone-100 pl-4">
                        {ABAYA_SUBMENU.map((item) => (
                          <Link key={item.label} href={item.href} onClick={() => setIsMobileOpen(false)} className="text-xs uppercase tracking-widest text-stone-500">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-stone-100 flex gap-6">
                 <Link href="/login" onClick={() => setIsMobileOpen(false)} className="text-xs uppercase font-bold tracking-widest">Account</Link>
                 <Link href="/cart" onClick={() => setIsMobileOpen(false)} className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">Cart (0)</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}