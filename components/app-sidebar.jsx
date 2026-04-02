"use client";
import { RefreshCw, Tag, CircleDollarSign, ArrowUpDown, Check } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function AppSidebar({ storedProducts = [], onFilterApply }) {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([0, 99000]);

  // 1. Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brand`);
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };
    fetchBrands();
  }, []);

  // 2. Dynamic Max Price logic
  const maxProductPrice = useMemo(() => {
    if (!storedProducts || storedProducts.length === 0) return 99000;
    // Add a small buffer to the max price
    return Math.max(...storedProducts.map((p) => p.selling || 0)) + 100;
  }, [storedProducts]);

  // 3. Sync Slider when Max Price changes (fixes the $6500 issue)
  useEffect(() => {
    if (maxProductPrice > 0) {
      setPriceRange([0, maxProductPrice]);
    }
  }, [maxProductPrice]);

  const handleApply = () => {
    onFilterApply({
      brand: selectedBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortOrder
    });
  };

  const handleReset = () => {
    setSelectedBrand("");
    setSortOrder("");
    setPriceRange([0, maxProductPrice]);
    onFilterApply({ brand: "", minPrice: 0, maxPrice: 99000, sort: "" });
  };

  return (
    <Sidebar className="border-r border-gray-100">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          {/* Header */}
          <SidebarGroupLabel className="flex justify-between items-center px-5 py-8 border-b border-gray-100 mb-4">
            <span className="text-xl font-bold text-gray-900 tracking-tight">Filters</span>
            <button 
              onClick={handleReset} 
              className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95 group"
              title="Reset Filters"
            >
              <RefreshCw size={18} className="text-gray-500 group-hover:text-black" />
            </button>
          </SidebarGroupLabel>

          {/* Sort Section */}
          <div className="px-5 mb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <ArrowUpDown size={16} />
              <p className="font-semibold text-sm uppercase tracking-wider">Sort by Price</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => setSortOrder(sortOrder === "low-high" ? "" : "low-high")}
                className={`text-xs p-3 rounded-xl border transition-all flex justify-between items-center ${
                  sortOrder === "low-high" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                Low to High
                {sortOrder === "low-high" && <Check size={14} />}
              </button>
              <button 
                onClick={() => setSortOrder(sortOrder === "high-low" ? "" : "high-low")}
                className={`text-xs p-3 rounded-xl border transition-all flex justify-between items-center ${
                  sortOrder === "high-low" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                High to Low
                {sortOrder === "high-low" && <Check size={14} />}
              </button>
            </div>
          </div>

          {/* Brand Section */}
          <div className="px-5 mb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <Tag size={16} />
              <p className="font-semibold text-sm uppercase tracking-wider">Brand</p>
            </div>
            <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <button
                onClick={() => setSelectedBrand("")}
                className={`w-full text-left text-xs p-2.5 rounded-lg transition-colors ${
                  selectedBrand === "" ? "bg-gray-100 font-bold text-black" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b._id}
                  onClick={() => setSelectedBrand(b._id)}
                  className={`w-full text-left text-xs p-2.5 rounded-lg transition-colors flex justify-between items-center ${
                    selectedBrand === b._id ? "bg-gray-100 font-bold text-black" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {b.title}
                  {selectedBrand === b._id && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="px-5 mb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <CircleDollarSign size={16} />
              <p className="font-semibold text-sm uppercase tracking-wider">Price Range</p>
            </div>
            <div className="px-2">
              <Slider 
                value={priceRange} 
                max={maxProductPrice} 
                step={1}
                onValueChange={setPriceRange} 
                className="my-6"
              />
              <div className="flex justify-between items-center">
                <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
                  <span className="text-[10px] text-gray-400 block uppercase">Min</span>
                  <span className="text-xs font-bold">${priceRange[0]}</span>
                </div>
                <div className="h-[1px] w-4 bg-gray-200" />
                <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">Max</span>
                  <span className="text-xs font-bold">${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </SidebarGroup>

        {/* Footer Action */}
        <div className="p-5 mt-auto border-t border-gray-100 bg-white sticky bottom-0">
          <button 
            onClick={handleApply} 
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
          >
            Apply Changes
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}