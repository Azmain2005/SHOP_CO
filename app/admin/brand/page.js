"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Plus,
  Globe,
  Trash2,
  Edit3,
  Save,
  X,
  ImageIcon,
  Layers,
  Package,
  Percent,
  Tag,
  LayoutGrid,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';



export default function BrandPage() {
  const pathname = usePathname();

  // States
  const [title, setTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");



  const router = useRouter();



  // Fetch all brands
  const fetchBrands = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brand`);
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  };

  const checkJWT = async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      router.push('/account/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      console.log(decoded.exp);
      console.log(currentTime);
      if (decoded.exp < currentTime) {
        localStorage.removeItem('auth_token');
        router.push('/account/login');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      router.push('/account/login');
    }
  }




  useEffect(() => {
    checkJWT();
    fetchBrands();
  }, []);

  // Add brand
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!title.trim()) {
      setMessage("Brand title cannot be empty.");
      return;
    }
    setLoading(true);

    const token = localStorage.getItem("auth_token");


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${token}`},
        body: JSON.stringify({ title, photoUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Success: Brand added successfully!");
        setTitle("");
        setPhotoUrl("");
        fetchBrands();
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Delete brand
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    const token = localStorage.getItem("auth_token");


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brand/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${token}`},
      });
      if (res.ok) {
        setMessage("Success: Brand deleted");
        fetchBrands();
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  // Edit logic
  const startEditing = (brand) => {
    setEditingId(brand._id);
    setEditingTitle(brand.title);
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;

    const token = localStorage.getItem("auth_token");


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/brand/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${token}`},
        body: JSON.stringify({ title: editingTitle }),
      });
      if (res.ok) {
        setMessage("Success: Brand updated");
        setEditingId(null);
        fetchBrands();
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const navItems = [
    { name: "Categories", href: "/admin/categorie", icon: LayoutGrid },
    { name: "Brands", href: "/admin/brand", icon: Globe },
    { name: "Tax Rules", href: "/admin/taxrule", icon: Percent },
    { name: "Collections", href: "/admin/collection", icon: Layers },
    { name: "Attributes", href: "/admin/attribute", icon: Tag },
    { name: "All Products", href: "/admin/allproduct", icon: Package },
  ];

  const filteredBrands = brands.filter(brand =>
    brand.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] text-gray-900 font-sans">

      {/* 1. FULL WIDTH HEADER NAVIGATION */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Package className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Admin Dashboard</span>
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA (FULL WIDTH) */}
      <main className="w-full p-6 lg:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* LEFT COLUMN: ADD BRAND (4/12) */}
          <section className="xl:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm sticky top-28">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add Brand</h2>
                <p className="text-gray-500 mt-2">Introduce a new brand to your catalog.</p>
              </div>

              <form onSubmit={handleSingleSubmit} className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-gray-700 ml-1">Brand Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Nike, Apple"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-gray-800"
                      required
                    />
                    <Globe className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-gray-700 ml-1">Logo URL</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://image-link.com/logo.png"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-gray-800"
                      required
                    />
                    <ImageIcon className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-lg mt-2 ${loading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 text-white shadow-xl shadow-gray-200 active:scale-[0.98]"
                    }`}
                >
                  {loading ? "Processing..." : <><Plus size={22} /> Create Brand</>}
                </button>
              </form>

              {message && (
                <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in fade-in slide-in-from-top-2 ${message.toLowerCase().includes("success")
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                  {message.toLowerCase().includes("success") ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {message}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: LIST VIEW (8/12) */}
          <section className="xl:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[70vh] flex flex-col overflow-hidden">

              {/* List Header with Search */}
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Brand Directory</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Live Inventory</p>
                </div>

                <div className="relative group">
                  <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Filter brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none w-full md:w-72 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* List Body */}
              <div className="p-8">
                {filteredBrands.length === 0 ? (
                  <div className="py-32 text-center">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Globe className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-400 text-xl font-medium">No brands found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredBrands.map((brand) => (
                      <div
                        key={brand._id}
                        className="group flex items-center justify-between p-5 rounded-[1.5rem] border border-gray-100 hover:border-black hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 bg-white"
                      >
                        <div className="flex items-center gap-5 flex-1 overflow-hidden">
                          <div className="relative w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={brand.photoUrl || `${process.env.NEXT_PUBLIC_BACKEND_URL}uploads/${brand.imageUrl || "placeholder.png"}`}
                              alt={brand.title}
                              width={64}
                              height={64}
                              className="object-contain p-2"
                              onError={(e) => (e.target.src = "/placeholder.png")}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            {editingId === brand._id ? (
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                className="w-full bg-white border-2 border-black p-2 rounded-xl focus:outline-none font-bold"
                                autoFocus
                              />
                            ) : (
                              <div>
                                <span className="text-gray-900 font-bold text-lg block truncate">{brand.title}</span>
                                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Brand ID: {brand._id.slice(-6)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          {editingId === brand._id ? (
                            <>
                              <button onClick={() => saveEdit(brand._id)} className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition active:scale-90">
                                <Save size={18} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition">
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEditing(brand)} className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-colors">
                                <Edit3 size={18} />
                              </button>
                              <button onClick={() => handleDelete(brand._id)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Stat */}
              <div className="mt-auto p-6 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Total Items: <span className="text-black ml-1">{filteredBrands.length}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}