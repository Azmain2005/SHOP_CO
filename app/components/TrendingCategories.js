"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: "men",
    label: "Men",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    href: "/product?category=men",
  },
  {
    id: "women",
    label: "Women",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    href: "/product?category=women",
  },
  {
    id: "boys",
    label: "Boys",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    href: "/product?category=boys",
  },
  {
    id: "girls",
    label: "Girls",
    img: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=400&q=80",
    href: "/product?category=girls",
  },
  {
    id: "panjabi",
    label: "Panjabi",
    img: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=400&q=80",
    href: "/product?category=panjabi",
  },
  {
    id: "saree",
    label: "Saree",
    img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
    href: "/product?category=saree",
  },
];

export default function TrendingCategories() {
  return (
    <section className="py-10 px-4 max-w-[1440px] mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-xl md:text-2xl font-bold tracking-widest text-gray-800 mb-8 uppercase"
      >
        Trending Categories
      </motion.h2>

      <div className="flex gap-4 md:gap-6 justify-center flex-wrap">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link href={cat.href} className="group flex flex-col items-center gap-2">
              <div className="relative w-[100px] h-[120px] md:w-[130px] md:h-[155px] lg:w-[160px] lg:h-[190px] rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-black transition-colors tracking-wide">
                {cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
