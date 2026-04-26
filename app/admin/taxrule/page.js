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
  Percent,
  LayoutGrid,
  Search,
  Globe,
  Layers,
  Tag,
  Package,
  FileText,
  Hash,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';




export default function TaxPage() {
  const pathname = usePathname();

  // States for new tax rule
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("number");
  const [number, setNumber] = useState("");

  // App states
  const [taxes, setTaxes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");



  const router = useRouter();





  // Editing state
  const [editingTax, setEditingTax] = useState({
    title: "",
    description: "",
    type: "number",
    number: "",
  });

  const fetchTaxes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tax`);
      const data = await res.json();
      setTaxes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch taxes", err);
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
    fetchTaxes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const token = localStorage.getItem("auth_token");


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tax`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`},
        body: JSON.stringify({ title, description, type, number }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Success: Tax rule added!");
        setTitle(""); setDescription(""); setType("number"); setNumber("");
        fetchTaxes();
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this tax rule?")) return;
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tax/${id}`, { method: "DELETE" ,
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${token}`},
      });
      if (res.ok) {
        setMessage("Success: Tax rule removed");
        fetchTaxes();
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const startEditing = (tax) => {
    setEditingId(tax._id);
    setEditingTax({
      title: tax.title,
      description: tax.description || "",
      type: tax.type,
      number: tax.number,
    });
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tax/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${token}`},
        body: JSON.stringify(editingTax),
      });
      if (res.ok) {
        setMessage("Success: Updated tax rule");
        setEditingId(null);
        fetchTaxes();
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

  const filteredTaxes = taxes.filter(tax =>
    tax.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#fdfdfd] text-gray-900 font-sans">

      {/* HEADER */}
      {/* <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Percent className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">Financial Settings</span>
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`}>
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header> */}

      {/* MAIN CONTENT */}
      <main className="w-full p-6 lg:p-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* LEFT: FORM */}
          <section className="xl:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm sticky top-28">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">Create Tax Rule</h2>
                <p className="text-gray-500 mt-2">Define new tax rates for your products.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Rule Title</label>
                  <div className="relative">
                    <input type="text" placeholder="e.g. VAT, GST, Sales Tax" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all" required />
                    <FileText className="absolute left-4 top-4 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Description (Optional)</label>
                  <textarea placeholder="Purpose of this tax..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border-transparent p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all h-24 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-gray-50 border-transparent p-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all appearance-none cursor-pointer">
                      <option value="number">Fixed Amount</option>
                      <option value="percent">Percentage</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Rate Value</label>
                    <div className="relative">
                      <input type="number" placeholder="0.00" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full bg-gray-50 border-transparent p-4 pl-12 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all" required />
                      <Hash className="absolute left-4 top-4 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-lg mt-4 ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-white shadow-xl active:scale-[0.98]"}`}>
                  {loading ? "Saving..." : <><Plus size={22} /> Add Tax Rule</>}
                </button>
              </form>

              {message && (
                <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in fade-in slide-in-from-top-2 ${message.toLowerCase().includes("success") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                  {message.toLowerCase().includes("success") ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {message}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: LIST */}
          <section className="xl:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[70vh] flex flex-col overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Tax Configurations</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Live Rules</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input type="text" placeholder="Filter rules..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none w-full md:w-72 transition-all" />
                </div>
              </div>

              <div className="p-8">
                {filteredTaxes.length === 0 ? (
                  <div className="py-32 text-center text-gray-400 font-medium text-xl">No tax rules found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredTaxes.map((tax) => (
                      <div key={tax._id} className="group flex flex-col p-6 rounded-[2rem] border border-gray-100 hover:border-black hover:shadow-2xl hover:shadow-gray-200/50 transition-all bg-white relative">
                        {editingId === tax._id ? (
                          <div className="space-y-4">
                            <input type="text" value={editingTax.title} onChange={(e) => setEditingTax({ ...editingTax, title: e.target.value })} className="w-full border-2 border-black p-2 rounded-xl focus:outline-none font-bold" />
                            <textarea value={editingTax.description} onChange={(e) => setEditingTax({ ...editingTax, description: e.target.value })} className="w-full border-2 border-black p-2 rounded-xl focus:outline-none text-sm" />
                            <div className="flex gap-2">
                              <select value={editingTax.type} onChange={(e) => setEditingTax({ ...editingTax, type: e.target.value })} className="flex-1 border-2 border-black p-2 rounded-xl">
                                <option value="number">Amount</option>
                                <option value="percent">Percentage</option>
                              </select>
                              <input type="number" value={editingTax.number} onChange={(e) => setEditingTax({ ...editingTax, number: e.target.value })} className="flex-1 border-2 border-black p-2 rounded-xl" />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(tax._id)} className="flex-1 py-2 bg-black text-white rounded-xl font-bold">Save</button>
                              <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-gray-100 rounded-xl">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tax.type === 'percent' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                  {tax.type === 'percent' ? <Percent size={24} /> : <Hash size={24} />}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 truncate">{tax.title}</h4>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditing(tax)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"><Edit3 size={18} /></button>
                                <button onClick={() => handleDelete(tax._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                              </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">{tax.description || "No description provided."}</p>
                            <div className="mt-auto flex items-end justify-between">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tax.type} rate</span>
                              <span className="text-3xl font-black text-black">
                                {tax.type === "percent" ? `${tax.number}%` : `$${tax.number}`}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-auto p-6 bg-gray-50/50 border-t border-gray-50 flex justify-end">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Rules: <span className="text-black ml-1">{filteredTaxes.length}</span></div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}