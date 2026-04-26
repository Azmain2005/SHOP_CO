"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Tag,
  Trash2,
  Edit3,
  Save,
  X,
  Layers,
  Package,
  Globe,
  Percent,
  LayoutGrid,
  Search,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';


export default function CategoryPage() {
  const pathname = usePathname();

  // States
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [type, setType] = useState("parent"); // Default to 'parent'
  const [parentId, setParentId] = useState(""); // Stores selected parent's _id

  const router = useRouter();



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


  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    checkJWT();
    fetchCategories();
  }, []);

  // Add category
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!title.trim()) {
      setMessage("Category title cannot be empty.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("auth_token");

    // Prepare the payload
    const payload = {
      title,
      type,
      parentid: type === "child" ? parentId : null,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Success: Category added successfully!");
        setTitle("");
        setType("parent"); // Reset
        setParentId(""); // Reset
        fetchCategories();
      } else {
        const data = await res.json();
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      if (res.ok) {
        setMessage("Success: Category deleted");
        fetchCategories();
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  // Edit logic
  const startEditing = (category) => {
    setEditingId(category._id);
    setEditingTitle(category.title);
  };

  const saveEdit = async (id) => {

    const token = localStorage.getItem("auth_token");

    if (!editingTitle.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingTitle }),
      });
      if (res.ok) {
        setMessage("Success: Category updated");
        setEditingId(null);
        fetchCategories();
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

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] text-gray-900 font-sans">

      {/* 1. FULL WIDTH HEADER NAVIGATION */}
      {/* <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
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
      </header> */}

      {/* 2. MAIN CONTENT AREA (FULL WIDTH) */}
      <main className="w-full p-6 lg:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* LEFT COLUMN: ADD CATEGORY (4/12) */}
          <section className="xl:col-span-4">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm sticky top-28">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Add Category</h2>
                <p className="text-gray-500 mt-2">Create a new category for your inventory system.</p>
              </div>

              <form onSubmit={handleSingleSubmit} className="space-y-6">
                {/* Category Title */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Category Title</label>
                  <input
                    type="text"
                    placeholder="Enter title (e.g. Menswear)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-transparent p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-gray-800 text-lg"
                    required
                  />
                </div>

                {/* Type Selection (Parent vs Child) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Category Type</label>
                  <div className="flex gap-4">
                    {["parent", "child"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold capitalize transition-all ${type === t
                          ? "border-black bg-black text-white"
                          : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Parent Selection Dropdown */}
                {type === "child" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Select Parent Category</label>
                    <select
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all text-gray-800"
                      required={type === "child"}
                    >
                      <option value="">-- Choose a Parent --</option>
                      {categories
                        .filter((cat) => cat.type === "parent")
                        .map((parent) => (
                          <option key={parent._id} value={parent._id}>
                            {parent.title}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-lg ${loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 text-white shadow-xl shadow-gray-200 active:scale-[0.98]"
                    }`}
                >
                  {loading ? "Creating..." : <><Plus size={22} /> Create Category</>}
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
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm min-h-[70vh] flex flex-col">

              {/* List Header with Search */}
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Registered Categories</h3>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mt-1">Manage your database</p>
                </div>

                <div className="relative group">
                  <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 outline-none w-full md:w-64 transition-all"
                  />
                </div>
              </div>

              {/* List Body */}
              <div className="p-8">
                {filteredCategories.length === 0 ? (
                  <div className="py-32 text-center">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <LayoutGrid className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-400 text-xl font-medium">No categories matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCategories.map((category) => (
                      <div
                        key={category._id}
                        className="group flex items-center justify-between p-5 rounded-2xl border border-gray-50 hover:border-black hover:shadow-xl hover:shadow-gray-100 transition-all bg-white"
                      >
                        <div className="flex-1 mr-4 overflow-hidden">
                          {editingId === category._id ? (
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="w-full bg-white border-2 border-black p-2 rounded-xl focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                <Tag size={20} />
                              </div>
                              <span className="text-gray-800 font-bold text-lg truncate">{category.title}</span>
                              {category.type === 'child' && (
                                <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                  Sub-category
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {editingId === category._id ? (
                            <>
                              <button onClick={() => saveEdit(category._id)} className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-100">
                                <Save size={18} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition">
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEditing(category)} className="p-3 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition">
                                <Edit3 size={18} />
                              </button>
                              <button onClick={() => handleDelete(category._id)} className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
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
                <div className="text-sm font-bold text-gray-400">
                  Total Results: <span className="text-black">{filteredCategories.length}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}