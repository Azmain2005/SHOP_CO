"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 1. Import this
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Card from "../components/Card";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
} from "@/components/ui/pagination";
import PromoBanner from "../components/topBar";

async function fetchProducts(page = 1, filters = {}) {
  const { brand, minPrice, maxPrice, sort, category } = filters;
  const params = new URLSearchParams({
    brand: brand || "",
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 99000,
    sort: sort || "",
    category: category || ""
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/page/${page}?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default function Page() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("category");
  const isId = /^[0-9a-fA-F]{24}$/.test(categoryName || "");
  const displayTitle = isId ? "Selected" : categoryName;

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    brand: "",
    minPrice: 0,
    maxPrice: 99000,
    sort: "",
    // category: categoryName || ""  <-- Remove this line
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryName]);

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["all-products", currentPage, filters, categoryName],
    queryFn: () => fetchProducts(currentPage, {
      ...filters,
      category: categoryName || "" // Inject URL param directly here
    }),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    setFilteredProducts(productsData?.data || []);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productsData]);

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-white">
        <div className="w-12 h-12 border-[1px] border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-stone-400 font-sans">Loading Atelier</p>
      </div>
    );
  }

  if (error) return (
    <div className="p-20 text-center font-serif italic text-stone-500">
      Our apologies, we couldn't load the collection. Please refresh.
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      <PromoBanner />
      <Navbar />

      <SidebarProvider>
        {/* FIX: The flex container below ensures Sidebar and Main are side-by-side */}
        <div className="flex w-full max-w-[1440px] mx-auto min-h-screen">

          <AppSidebar
            storedProducts={productsData?.data || []}
            onFilterApply={handleFilterApply}
          />

          {/* FIX: flex-1 allows the main content to fill the remaining horizontal space */}
          <main className="flex-1 px-6 md:px-12 pb-32 pt-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between w-full mb-12 gap-6 border-b border-stone-100 pb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-2 block">
                  {displayTitle ? displayTitle : "The Collection"}
                </span>
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 capitalize">
                  {displayTitle ? displayTitle : "All"} <span className="italic">Creations</span>
                </h1>
              </div>

              {/* Minimalist Filter Trigger */}
              <SidebarTrigger asChild>
                <button className="group flex items-center gap-3 py-2 px-1 transition-all">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600 group-hover:text-black">
                    Filter & Sort
                  </span>
                  <div className="bg-stone-100 p-2 rounded-full group-hover:bg-stone-900 group-hover:text-white transition-colors">
                    <SlidersHorizontal size={16} />
                  </div>
                </button>
              </SidebarTrigger>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-40 text-center">
                <p className="font-serif italic text-xl text-stone-400">No pieces found in this selection.</p>
                <button
                  onClick={() => handleFilterApply({ brand: "", minPrice: 0, maxPrice: 99000, sort: "" })}
                  className="mt-4 text-[10px] uppercase tracking-widest border-b border-stone-300 pb-1 hover:border-stone-900 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 lg:gap-x-10">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full"
                  >
                    <Link href={`/ProductDetails/${product._id}`} className="group">
                      <Card
                        image={product.photos?.[0]}
                        title={product.title}
                        rating={product.rating || 5}
                        price={product.selling}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination Component */}
            {filteredProducts.length > 0 && (
              <div className="mt-24 flex justify-center pt-12 border-t border-stone-100">
                <Pagination>
                  <PaginationContent className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold disabled:opacity-20 hover:text-[#D4AF37] transition-colors"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <div className="flex items-center gap-2 px-8">
                      <span className="text-xs font-serif italic text-stone-400">Page</span>
                      <span className="text-sm font-bold">{currentPage}</span>
                      <span className="text-xs font-serif italic text-stone-400 mx-1">of</span>
                      <span className="text-sm font-bold">{productsData?.totalPages || 1}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (currentPage < (productsData?.totalPages || 1)) {
                          setCurrentPage((p) => p + 1);
                        }
                      }}
                      disabled={currentPage >= (productsData?.totalPages || 1)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold disabled:opacity-20 hover:text-[#D4AF37] transition-colors"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}