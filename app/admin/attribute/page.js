"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AttributePage() {
  const [title, setTitle] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [values, setValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ title: "", values: [] });

  // 🟢 Fetch all attributes
  const fetchAttributes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/attribute`);
      const data = await res.json();
      setAttributes(data);
    } catch (err) {
      console.error("Failed to fetch attributes:", err);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // 🟢 Add value to array before saving
  const handleAddValue = () => {
    const trimmed = valueInput.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values, trimmed]);
      setValueInput("");
    }
  };

  const handleRemoveValue = (v) => {
    setValues(values.filter((val) => val !== v));
  };

  // 🟢 Submit new attribute
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || values.length === 0) {
      setMessage("Title and at least one value are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/attribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, values }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Attribute added successfully!");
        setTitle("");
        setValues([]);
        fetchAttributes();
      } else {
        setMessage("❌ " + (data.error || "Failed to add attribute."));
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Delete attribute
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/attribute/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Attribute deleted successfully!");
        fetchAttributes();
      } else {
        setMessage("❌ " + (data.error || "Failed to delete attribute."));
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  // 🟢 Edit
  const startEditing = (attr) => {
    setEditingId(attr._id);
    setEditingData({ title: attr.title, values: attr.values });
  };

  const saveEdit = async (id) => {
    if (!editingData.title.trim() || editingData.values.length === 0) {
      setMessage("Title and at least one value required.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/attribute/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Attribute updated successfully!");
        setEditingId(null);
        fetchAttributes();
      } else {
        setMessage("❌ " + (data.error || "Failed to update."));
      }
    } catch (err) {
      setMessage("Server error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 p-6">
      <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <Link href="/admin/categorie" className="px-4 py-2 bg-black text-white rounded-2xl shadow hover:opacity-95">Categories</Link>
                    <Link href="/admin/brand" className="px-4 py-2 bg-black text-white rounded-2xl shadow hover:opacity-95">Brands</Link>
                    <Link href="/admin/taxrule" className="px-4 py-2 bg-black text-white rounded-2xl shadow hover:opacity-95">Tax rules</Link>
                    <Link href="/admin/collection" className="px-4 py-2 bg-black text-white rounded-2xl shadow hover:opacity-95">Collections</Link>
                    <Link href="/admin/attribute" className="px-4 py-2 bg-black text-white rounded-2xl shadow hover:opacity-95">Attributes</Link>
                    <Link href="/admin/allproduct" className="px-4 py-2 bg-black text-white rounded-2xl shadow hover:opacity-95">All products</Link>
                </div>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Add Attribute Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Add Attribute
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Attribute Title (e.g., Color)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-indigo-200"
              required
            />

            {/* Add Values */}
            <div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a value (e.g., Red)"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  className="flex-1 border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="button"
                  onClick={handleAddValue}
                  className="bg-black text-white px-5 py-2 rounded-2xl hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>

              {/* Show added values */}
              <div className="flex flex-wrap gap-2 mt-3">
                {values.map((v) => (
                  <span
                    key={v}
                    className="bg-gray-200 text-black px-3 py-1 rounded-xl flex items-center space-x-2"
                  >
                    <span>{v}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(v)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-700"
                  : "bg-gradient-to-r bg-black hover:bg-gray-500 text-white shadow-lg"
              }`}
            >
              {loading ? "Adding..." : "Add Attribute"}
            </button>
          </form>

          {message && (
            <p
              className={`text-center mt-4 font-medium ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Attribute List */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            All Attributes
          </h2>
          {attributes.length === 0 ? (
            <p className="text-gray-500">No attributes found.</p>
          ) : (
            <ul className="space-y-3">
              {attributes.map((attr) => (
                <li
                  key={attr._id}
                  className="border border-gray-200 p-4 rounded-2xl flex justify-between items-start hover:shadow-md transition"
                >
                  {editingId === attr._id ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editingData.title}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            title: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 p-2 rounded-2xl"
                      />
                      <div className="flex flex-wrap gap-2">
                        {editingData.values.map((v, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-xl flex items-center space-x-2"
                          >
                            <span>{v}</span>
                            <button
                              onClick={() =>
                                setEditingData({
                                  ...editingData,
                                  values: editingData.values.filter(
                                    (val) => val !== v
                                  ),
                                })
                              }
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-medium text-lg">
                        {attr.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {attr.values.map((v, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-xl text-sm"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 ml-4">
                    {editingId === attr._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(attr._id)}
                          className="bg-green-500 text-white px-4 py-1 rounded-2xl hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 text-gray-700 px-4 py-1 rounded-2xl hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(attr)}
                          className="bg-indigo-500 text-white px-4 py-1 rounded-2xl hover:bg-indigo-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attr._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-2xl hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
