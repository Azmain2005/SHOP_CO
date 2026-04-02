"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Card from "../components/Card";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import PromoBanner from "../components/topBar";

async function fetchProducts(page = 1, filters = {}) {
  const { brand, minPrice, maxPrice, sort } = filters;
  const params = new URLSearchParams({
    brand: brand || "",
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 99000,
    sort: sort || ""
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/page/${page}?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default function Page() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    brand: "", minPrice: 0, maxPrice: 99000, sort: ""
  });

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["all-products", currentPage, filters],
    queryFn: () => fetchProducts(currentPage, filters),
    keepPreviousData: true,
  });

  useEffect(() => {
    setFilteredProducts(productsData?.data || []);
  }, [productsData]);

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="p-20 text-center text-red-500">Error loading products. Please try again.</div>;

  return (
    <div className="bg-white min-h-screen">
      <PromoBanner />
      <Navbar />

      <SidebarProvider>
        <div className="flex flex-col md:flex-row w-full max-w-[1440px] mx-auto">
          {/* Sidebar - Hidden on mobile, controlled by Trigger */}
          <AppSidebar
            storedProducts={productsData?.data || []}
            onFilterApply={handleFilterApply}
          />

          <main className="flex-1 w-full px-4 md:px-8 pb-20">
            {/* Mobile/Desktop Header Section */}
            <div className="flex items-center justify-between w-full mb-6">
              <div>
                <h1 className="text-2xl font-bold text-black uppercase tracking-tighter">All Products</h1>
              </div>

              {/* Custom Filter Button */}
              <SidebarTrigger asChild>
                <button className="flex items-center justify-center bg-black hover:bg-gray-800 text-white w-10 h-10 md:w-auto md:px-4 md:py-2 rounded-full transition-all shrink-0">
                  <SlidersHorizontal size={20} className="text-white" />
                  <span className="hidden md:inline ml-2 text-sm font-medium text-white">Filters</span>
                </button>
              </SidebarTrigger>
            </div>
            {/* Product Grid - Optimized for Mobile Image Size */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-32 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <SlidersHorizontal size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-900 font-semibold text-lg">No matches found</p>
              </div>
            ) : (
              /* CHANGE: Reduced gap from gap-3 to gap-2 on mobile (xs) 
                 and removed horizontal padding on the container for mobile.
              */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 w-full px-2">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="w-full max-w-[180px] mx-auto md:max-w-none">
                    <Link href={`/ProductDetails/${product._id}`}>
                      <Card
                        image={product.photos?.[0]}
                        title={product.title}
                        rating={3}
                        price={product.selling}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Component */}
            {filteredProducts.length > 0 && (
              <div className="mt-16 flex justify-center border-t border-gray-100 pt-10">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    </PaginationItem>

                    {[...Array(productsData?.totalPages || 1)].map((_, i) => (
                      <PaginationItem key={i + 1} className="hidden sm:block">
                        <PaginationLink
                          className={`cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center transition-all ${currentPage === i + 1
                            ? "bg-black text-white border-black"
                            : "border border-gray-200 hover:border-black"
                            }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <button
                        onClick={() => {
                          if (currentPage < (productsData?.totalPages || 1)) {
                            setCurrentPage((p) => p + 1);
                          }
                        }}
                        disabled={currentPage >= (productsData?.totalPages || 1)}
                        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </PaginationItem>
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