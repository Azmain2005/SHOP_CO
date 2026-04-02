"use client";

import Navbar from '@/app/components/Navbar';
import React, { useState, useEffect, use } from 'react';
import { useQuery } from "@tanstack/react-query";
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import Image from 'next/image';
import FeaturedProduct from '@/app/components/TopSellings';
import Footer from '@/app/components/Footer';
import PromoBanner from '@/app/components/topBar';
import { Star } from "lucide-react";
import TestimonialCard from "../../components/TestiominalCard";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";


export default function Page({ params }) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [activeTab, setActiveTab] = useState("Product Details");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const { data: session } = useSession();

  const [mainImage, setMainImage] = useState(null);

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return Array.isArray(data) ? data[0] : data;
    },
  });

  useEffect(() => {
    if (product) {
      const img = (product.photos?.length > 0 && product.photos[0] !== "")
        ? product.photos[0]
        : product.image;
      setMainImage(img);
    }
  }, [product]);

  // Cart logic
  useEffect(() => {
    const CreateDefaultCart = async () => {
      try {
        const existingCartId = localStorage.getItem("cartId");
        if (existingCartId) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/specificcart/${existingCartId}`);
          if (res.status === 200) {
            const data = await res.json();
            if (data.cart?.cartStatus === "editing") return;
          }
          localStorage.removeItem("cartId");
        }
        const cartRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const cartData = await cartRes.json();
        if (cartData?._id) localStorage.setItem("cartId", cartData._id);
      } catch (err) {
        console.error("Cart setup failed:", err);
      }
    };
    CreateDefaultCart();
  }, []);


  // Update currentPrice when the product data loads
  useEffect(() => {
    if (product) {
      setCurrentPrice(product.selling || product.purchased);
    }
  }, [product]);

  const handleAddToCart = async () => {
    // 1. Ensure all attributes are selected
    if (product.attributes?.length > 0) {
      const selectedCount = Object.keys(selectedAttributes).length;
      if (selectedCount < product.attributes.length) {
        return toast.error("Please select all options (Size, Color, etc.)");
      }
    }

    const cartId = localStorage.getItem("cartId");
    if (!cartId) return toast.error("Cart not initialized.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product._id,
          count: quantity,
          attributes: selectedAttributes,
          price: currentPrice, // ✅ Send the variant price to the cart
        }),
      });

      if (res.ok) {
        toast.success("Added to cart 🛒");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Try again.");
    }
  };

  if (productLoading) return <div className="h-screen flex justify-center items-center"><div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>;
  if (productError || !product) return <p className="p-10 text-center">Data not found.</p>;

  const isProject = !product.photos || product.photos.length === 0 || product.photos[0] === "";
  const hasPhotos = product.photos && product.photos.length > 0 && product.photos[0] !== "";

  return (
    <>
      <PromoBanner />
      <Navbar />

      <div className="container mx-auto p-4 md:p-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* --- LEFT: Images --- */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col-reverse md:flex-row gap-5">

            {/* THUMBNAILS: Vertical on desktop, horizontal on mobile */}
            {/* Thumbnails */}
            {hasPhotos && (
              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide min-w-[100px]">
                {product.photos.filter(img => img !== "").map((img, idx) => (
                  <button
                    key={idx}
                    onMouseEnter={() => setMainImage(img)}
                    onClick={() => setMainImage(img)}
                    /* Combined everything into one clean border/rounded logic */
                    className={`relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 rounded-[15px] overflow-hidden border-2 transition-all duration-200 isolate ${mainImage === img ? "border-black" : "border-[#F0F0F0] bg-[#F0F0F0]"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`view-${idx}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* MAIN IMAGE WITH CSS ZOOM */}
            <div className="flex-1 relative aspect-[3/4] rounded-[20px] overflow-hidden bg-[#F0EEED] cursor-zoom-in group isolate border border-gray-100">
              <Image
                key={mainImage}
                src={mainImage || product.image || "/placeholder.png"}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                unoptimized
              />
            </div>
          </div>

          {/* --- RIGHT: Details --- */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-6">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{product.title}</h1>

            <div className="flex items-center gap-3">
              {/* Use currentPrice here! */}
              <span className="text-3xl font-bold">${currentPrice}</span>

              {/* Only show the 'original' price strike-through if we are looking at the base price */}
              {product.selling && currentPrice === (product.selling || product.purchased) && (
                <>
                  <span className="text-3xl font-bold text-gray-300 line-through">
                    ${Math.round(product.selling * 1.15)}
                  </span>
                  <span className="bg-red-100 text-red-400 px-3 py-1 rounded-full text-sm font-bold">
                    -15%
                  </span>
                </>
              )}
            </div>

            {/* SMALL DESCRIPTION (OVERVIEW) & POLICIES */}
            <div className="space-y-4 border-b pb-6">
              <p className="text-gray-500 leading-relaxed">
                {product.overview || "Quick overview not available."}
              </p>

              {(product.refundable || product.warrenty) && (
                <div className="flex flex-col gap-1 text-sm font-medium pt-2">
                  <p className="text-black uppercase">Return Policy: <span className="text-gray-500 font-normal">{product.refundable}</span></p>
                  <p className="text-black uppercase">Warranty: <span className="text-gray-500 font-normal">{product.warrenty}</span></p>
                </div>
              )}
            </div>

            {/* Updated Attributes Logic (Price Based) */}
            {product.attributes?.length > 0 && product.attributes.map((attr) => (
              <div key={attr._id || attr.title} className="mb-4">
                <p className="text-gray-900 font-bold mb-3 uppercase tracking-tight text-sm">
                  Select {attr.title}
                </p>
                <div className="flex flex-wrap gap-3">
                  {attr.values?.map((vObj, idx) => {
                    const isSelected = selectedAttributes[attr.title] === vObj.val;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedAttributes(prev => ({ ...prev, [attr.title]: vObj.val }));
                          // Update the price displayed on the page
                          setCurrentPrice(vObj.price);
                        }}
                        className={`px-6 py-3 rounded-full border text-sm font-bold transition-all flex flex-col items-center min-w-[80px] 
              ${isSelected
                            ? "bg-black text-white border-black"
                            : "bg-[#F0F0F0] text-gray-600 border-transparent hover:border-gray-300"
                          }`}
                      >
                        <span>{vObj.val}</span>
                        <span className={`text-[10px] mt-1 ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                          ${vObj.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-4">
              <div className="flex items-center bg-[#F0F0F0] rounded-full px-4">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 font-bold">-</button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 font-bold">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 bg-black text-white rounded-full font-bold hover:opacity-90 transition-opacity">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION (Detailed Description here) --- */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <div className="w-full max-w-[1200px] mx-auto">
            <ul className="flex justify-around border-b border-gray-100 mb-8">
              {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
                <li
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 cursor-pointer transition-all text-sm md:text-base ${activeTab === tab ? "border-b-2 border-black font-bold text-black" : "text-gray-400 hover:text-black"}`}
                >
                  {tab}
                </li>
              ))}
            </ul>

            <div className="min-h-[300px]">
              {activeTab === "Product Details" && (
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description || "No detailed description available."}
                </div>
              )}
              {/* ... other tabs ... */}
            </div>
          </div>
        </div>
      </div>
      <FeaturedProduct />
      <Footer />
    </>
  );
}