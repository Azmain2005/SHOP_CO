"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import festiveImg from "../../public/festive_banner.png";

export default function FestiveBanner() {
  return (
    <section className="w-full relative overflow-hidden bg-[#c8802a]">
      {/* Background image fills full width */}
      <div className="relative w-full" style={{ minHeight: "420px" }}>
        <Image
          src={festiveImg}
          alt="Festive Collection Banner"
          priority
          className="w-full object-cover object-center"
          style={{ maxHeight: "540px", width: "100%", objectFit: "cover" }}
        />

        {/* Central overlay text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <p
            className="font-extrabold drop-shadow-lg leading-none"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              color: "#c8102e",
              fontFamily: "'Noto Serif Bengali', 'Hind Siliguri', serif",
              textShadow: "2px 2px 8px rgba(255,255,255,0.6)",
            }}
          >
            বৈশাখী উৎসব
          </p>
          <p
            className="mt-2 font-bold drop-shadow"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.75rem)",
              color: "#7a1a1a",
              textShadow: "1px 1px 4px rgba(255,255,255,0.5)",
            }}
          >
            পহেলা বৈশাখ ১৪৩২
          </p>
          <Link
            href="/product"
            className="mt-6 inline-block bg-[#c8102e] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#a50d26] transition-all duration-300 hover:scale-105 text-sm md:text-base"
          >
            Shop the Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
