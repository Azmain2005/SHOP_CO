"use client";

import React from "react";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-stone-50 pt-24 pb-12 px-6 md:px-12 lg:px-20 border-t border-stone-100">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        
        {/* Brand Identity */}
        <div className="lg:col-span-2 max-w-sm">
          <Link href="/" className="group">
            <h1 className="text-3xl font-serif tracking-tighter text-stone-900 uppercase mb-6">
              InStyle<span className="font-light italic text-stone-400">by</span>Shifa
            </h1>
          </Link>
          <p className="text-stone-500 text-sm leading-relaxed font-light mb-8 italic">
            Crafting timeless silhouettes for the modern woman. Our atelier focuses on artisanal quality, ensuring every Abaya, Kaftan, and Borka is a masterpiece of modesty.
          </p>
          <div className="flex gap-6 text-stone-400">
            <Link href="#" className="hover:text-[#D4AF37] transition-colors"><FiInstagram size={20}/></Link>
            <Link href="#" className="hover:text-[#D4AF37] transition-colors"><FiFacebook size={20}/></Link>
            <Link href="#" className="hover:text-[#D4AF37] transition-colors"><FiTwitter size={20}/></Link>
            <Link href="#" className="hover:text-[#D4AF37] transition-colors"><FiYoutube size={20}/></Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-stone-900 uppercase">The House</h4>
          <ul className="flex flex-col gap-4 text-[13px] text-stone-500 font-light">
            <li><Link href="/" className="hover:text-stone-900 transition-colors">Our Story</Link></li>
            <li><Link href="/" className="hover:text-stone-900 transition-colors">Craftsmanship</Link></li>
            <li><Link href="/" className="hover:text-stone-900 transition-colors">The Atelier</Link></li>
            <li><Link href="/" className="hover:text-stone-900 transition-colors">Careers</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-stone-900 uppercase">Concierge</h4>
          <ul className="flex flex-col gap-4 text-[13px] text-stone-500 font-light">
            <li><Link href="/" className="hover:text-stone-900 transition-colors">Size Guide</Link></li>
            <li><Link href="/" className="hover:text-stone-900 transition-colors">Shipping Policy</Link></li>
            <li><Link href="/" className="hover:text-stone-900 transition-colors">Return Request</Link></li>
            <li><Link href="/" className="hover:text-stone-900 transition-colors">Privacy</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-[11px] font-bold tracking-[0.2em] text-stone-900 uppercase">Contact</h4>
          <ul className="flex flex-col gap-4 text-[13px] text-stone-500 font-light">
            <li className="flex flex-col">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">Email</span>
              <span className="text-stone-800">atelier@instylebyshifa.com</span>
            </li>
            <li className="flex flex-col">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">WhatsApp</span>
              <span className="text-stone-800">+880 1234 567890</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal Bar */}
      <div className="mt-24 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] text-stone-400 uppercase">
        <p>© 2026 InStylebyShifa Atelier. All Rights Reserved.</p>
        <div className="flex gap-8">
           <Link href="#" className="hover:text-stone-900">Terms</Link>
           <Link href="#" className="hover:text-stone-900">Privacy</Link>
           <Link href="#" className="hover:text-stone-900">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}