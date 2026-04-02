// app/components/Card.js
import Image from "next/image";
import { Star } from "lucide-react";

export default function Card({ image, title, reviews, rating, price }) {
  return (
    <div className="flex flex-col w-full group">
      {/* Image Container: High aspect ratio, no padding */}
      <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#F0EEED] relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Details: Small margin top */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-bold text-black truncate pr-2 uppercase">
          {title}
        </h3>
        
        {/* Rating Row */}
        <div className="flex items-center gap-1 text-[#FFC633]">
          {"★".repeat(Math.floor(rating))}
          <span className="text-gray-400 text-xs ml-1">{rating}/5</span>
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-black">${price}</p>
      </div>
    </div>
  );
}
