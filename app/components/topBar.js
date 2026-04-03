"use client";
import { useState } from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-black text-white text-sm px-4 py-[14px]">
      <div className="container mx-auto flex items-center justify-center relative">
        {/* Centered Text */}
        <p className="text-center w-full text-[13px] tracking-wide">
          ✨ Eid Special — Get 20% off on all Abaya & Kaftan collections.{" "}
          <Link href="/product" className="underline font-semibold hover:text-gray-300 transition-colors">
            Shop Now
          </Link>
        </p>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-gray-400 transition-colors"
        >
          <FiX className="text-lg" />
        </button>
      </div>
    </div>
  );
}
