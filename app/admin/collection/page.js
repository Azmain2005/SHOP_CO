"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Layers, 
  Search, 
  LayoutGrid, 
  Globe, 
  Percent, 
  Tag, 
  Package, 
  FileStack,
  AlignLeft,
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';



export default function CollectionPage() {
  const pathname = usePathname();
  
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Data States
  const [collections, setCollections] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCollection, setEditingCollection] = useState({
    title: "",
    description: "",
  });

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

  // Fetch all collections
  const fetchCollections = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/collection`);
      const data = await res.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    }
  };

  useEffect(() => {
    checkJWT();
    fetchCollections();
  }, []);

  // Add new collection
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Title cannot be empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json"  ,
          "Authorization": `Bearer ${token}`},
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Success: Collection created!");
        setTitle("");
        setDescription("");
        fetchCollections();
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Delete collection
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    const token = localStorage.getItem("auth_token");


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/collection/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${token}`},
      });
      if (res.ok) {
        setMessage("Success: Collection deleted");
        fetchCollections();
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  // Edit logic
  const startEditing = (collection) => {
    setEditingId(collection._id);
    setEditingCollection({
      title: collection.title,
      description: collection.description || "",
    });
  };

  const saveEdit = async (id) => {
    if (!editingCollection.title.trim()) return;

    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/collection/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` },
        body: JSON.stringify(editingCollection),
      });
      if (res.ok) {
        setMessage("Success: Collection updated");
        setEditingId(null);
        fetchCollections();
      }
    } catch (err) {
      setMessage("Update failed");
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

  const filteredCollections = collections.filter(col => 
    col.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] text-gray-900 font-sans">
      
      {/* HEADER NAVIGATION */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
              <Layers className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Store Content</span>
          </div>
          
          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? "bg-black text-white shadow-xl" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`}>
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="w-full p-6 lg:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* LEFT: ADD COLLECTION FORM */}
          <section className="xl:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm sticky top-28">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">New Collection</h2>
                <p className="text-gray-500 mt-2">Group products into seasonal or thematic sets.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-gray-700 ml-1">Collection Title</label>
                  <div className="relative">
                    <input type="text" placeholder="e.g. Summer Sale 2026" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all" required />
                    <FileStack className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                  <div className="relative">
                    <textarea placeholder="Describe the theme or purpose..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all h-32 resize-none" />
                    <AlignLeft className="absolute left-4 top-4 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  </div>
                </div>
                
                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-lg mt-2 ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-white shadow-xl shadow-gray-200 active:scale-[0.98]"}`}>
                  {loading ? "Creating..." : <><Plus size={22} /> Create Collection</>}
                </button>
              </form>

              {message && (
                <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in fade-in slide-in-from-top-2 ${message.toLowerCase().includes("success") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                  {message.toLowerCase().includes("success") ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                  {message}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: COLLECTIONS LIST */}
          <section className="xl:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[70vh] flex flex-col overflow-hidden">
              
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Collections Library</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage themes</p>
                </div>
                
                <div className="relative group">
                  <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                  <input type="text" placeholder="Search collections..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none w-full md:w-72 transition-all shadow-sm" />
                </div>
              </div>

              <div className="p-8">
                {filteredCollections.length === 0 ? (
                  <div className="py-32 text-center text-gray-400 font-medium text-xl">No collections found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredCollections.map((col) => (
                      <div key={col._id} className="group flex flex-col p-6 rounded-[2rem] border border-gray-100 hover:border-black hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 bg-white">
                        
                        {editingId === col._id ? (
                          <div className="space-y-4">
                            <input type="text" value={editingCollection.title} onChange={(e) => setEditingCollection({ ...editingCollection, title: e.target.value })} className="w-full border-2 border-black p-2 rounded-xl focus:outline-none font-bold" />
                            <textarea value={editingCollection.description} onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })} className="w-full border-2 border-black p-2 rounded-xl focus:outline-none text-sm h-24" />
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(col._id)} className="flex-1 py-2 bg-black text-white rounded-xl font-bold">Save</button>
                              <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-gray-100 rounded-xl">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                  <Layers size={22} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 truncate pr-2">{col.title}</h4>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditing(col)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                                  <Edit3 size={18} />
                                </button>
                                <button onClick={() => handleDelete(col._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 h-14 leading-relaxed">
                              {col.description || "No description provided for this collection."}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Live Entry</span>
                              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Active</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-auto p-6 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Total Collections: <span className="text-black ml-1">{filteredCollections.length}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}