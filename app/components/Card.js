// app/components/Card.js
"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Card({ image, title, price, hoverImage }) {
  return (
    <div className="flex flex-col w-full group cursor-pointer">
      {/* Image Container: Tall, elegant ratio */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F9F8F6]">
        
        {/* Primary Image */}
        <Image
          src={image || "/placeholder.png"}
          alt={title}
          fill
          className={`object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105 ${
            hoverImage ? "group-hover:opacity-0" : ""
          }`}
          unoptimized
        />

        {/* Secondary Image (Visible on Hover) */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${title} alternate view`}
            fill
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-100 transition-all duration-[1.2s] ease-in-out"
            unoptimized
          />
        )}

        {/* Minimalist "Quick View" Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out bg-white/10 backdrop-blur-md border-t border-white/20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white text-center font-medium">
              View Creation
            </p>
        </div>
      </div>

      {/* Details Section: Center Aligned & Spaced */}
      <div className="mt-6 flex flex-col items-center text-center">
        {/* Category/Status Label */}
        <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] mb-2 font-semibold">
          L'Atelier
        </span>

        {/* Product Title: High-Contrast Serif */}
        <h3 className="text-base md:text-lg font-serif text-stone-900 tracking-tight leading-tight max-w-[90%] truncate">
          {title}
        </h3>

        {/* Price & Currency: Clean Sans-Serif */}
        <div className="mt-2 relative overflow-hidden h-6 w-full flex justify-center">
           <motion.p 
             initial={{ y: 0 }}
             whileHover={{ y: -30 }}
             className="text-[13px] font-light tracking-[0.15em] text-stone-500 absolute"
           >
             ${price}
           </motion.p>
           
           {/* Hidden "Explore" text that slides up on hover */}
           <motion.p 
             initial={{ y: 30 }}
             whileHover={{ y: 0 }}
             className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold absolute"
           >
             Details
           </motion.p>
        </div>
      </div>
    </div>
  );
}