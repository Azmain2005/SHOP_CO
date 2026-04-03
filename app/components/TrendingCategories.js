"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: "abaya",
    label: "Abaya",
    img: "https://i.ibb.co.com/mC7hXR4C/abdul-raheem-kannath-CWD8-UDt3y-PI-unsplash.jpg",
    href: "/product?category=abaya",
    description: "Modern Silhouettes"
  },
  {
    id: "kaftan",
    label: "Kaftan",
    img: "https://i.ibb.co.com/ymdYSwVq/image.png",
    href: "/product?category=kaftan",
    description: "Flowing Elegance"
  },
  {
    id: "borka",
    label: "Borka",
    img: "https://i.ibb.co.com/NdtRb9GD/modern-stylish-muslim-woman-hijab-city-street.jpg",
    href: "/product?category=borka",
    description: "Classic Modesty"
  },
  {
    id: "hijab",
    label: "Hijab",
    img: "https://i.ibb.co.com/27Mm3Y7Y/muhammad-faiz-zulkeflee-Kr-R7x-En4-HV8-unsplash.jpg",
    href: "/product?category=hijab",
    description: "Signature Silk"
  },
];

export default function TrendingCategories() {
  return (
    <section className="py-20 px-6 bg-white max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-3"
        >
          Curated Essentials
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-serif text-stone-900 text-center tracking-tight"
        >
          Explore <span className="italic">Collections</span>
        </motion.h2>
        <div className="w-12 h-[1px] bg-stone-200 mt-6" />
      </div>

      {/* Grid Layout - Responsive 1 to 4 columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
          >
            <Link href={cat.href} className="group relative block overflow-hidden bg-stone-100">
              {/* Image Container with 4:5 Aspect Ratio */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                
                {/* Minimal Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />
                
                {/* Bottom Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[10px] text-white/80 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {cat.description}
                  </p>
                  <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide">
                    {cat.label}
                  </h3>
                </div>
              </div>

              {/* Reveal Line on Hover */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#D4AF37] group-hover:w-full transition-all duration-700" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}