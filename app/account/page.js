"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import PromoBanner from '../components/topBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import axios from "axios";




// Icons
import { User, History, Package, MapPin, Mail, Phone, Calendar, ListOrdered } from 'lucide-react';


// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 25 } }
};



// Add { user } as a prop here
const UserDetailsSection = ({ user }) => (
  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-50">
        {/* Use user.image or a fallback */}
        <img
          src={user.image}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-50"
          alt="Profile"
        />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{user?.name || "Guest"}</h3>
          <p className="text-gray-500 text-sm italic">Verified Account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: Mail, label: "Email Address", value: user?.email },
          // Note: localstorage only has name, email, image based on your setup. 
          // You can keep the others as placeholders or add them to storage later.
          { icon: Phone, label: "Phone Number", value: user?.number || "Not Provided" },
          { icon: MapPin, label: "Default Address", value: "Not Provided" },
          { icon: Calendar, label: "Registration Date", value: "Member" },
        ].map((info, i) => (
          <motion.div key={i} variants={itemVariants} className="flex gap-4">
            <div className="p-2 bg-gray-50 rounded-lg h-fit"><info.icon className="w-4 h-4 text-gray-600" /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{info.label}</p>
              <p className="text-gray-900 font-medium">{info.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <button
      onClick={() => {
        localStorage.removeItem("user"); // ✅ remove saved user
        signOut({ callbackUrl: "/login" }); // ✅ sign out and redirect
      }}
      className="px-4 py-2 rounded bg-black text-white"
    >
      Logout
    </button>

  </motion.div>
);


// --- Main Page ---
export default function AccountPage() {
  const [localUser, setLocalUser] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");




  useEffect(() => {
    if (status === "authenticated") {
      console.log("User ID:", session.user.id);
      const { name, email, image, id } = session.user;
      console.log(session.user);
      localStorage.setItem(
        "user",
        JSON.stringify({ name, email, image, id })
      );
      handleSingleSubmit(name, email, image, id);
      CreateDefaultCart();
    }
  }, [status]);




  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login'); // ✅ safe here
    }
  }, [status, router]);


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setLocalUser(JSON.parse(savedUser));
    }
  }, []);




  const CreateDefaultCart = async () => {
    try {
      const existingCartId = localStorage.getItem("cartId");

      // 1️⃣ If cartId exists → verify it
      if (existingCartId) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/specificcart/${existingCartId}`
          );

          if (res.status === 200) {
            const data = await res.json();

            // Verify cart is still in editing status
            if (data.cart?.cartStatus === "editing") {
              console.log("Valid editing cart found:", existingCartId);
              return; // ✅ Everything is fine
            }
          }

          // If not editing or not found → remove it
          localStorage.removeItem("cartId");
        } catch (err) {
          localStorage.removeItem("cartId");
        }
      }

      // 2️⃣ Create new default cart (no user sent)
      const cartRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // sending nothing
        }
      );

      const cartData = await cartRes.json();

      if (cartData?._id) {
        localStorage.setItem("cartId", cartData._id);
        console.log("New default cart created:", cartData._id);
      }
    } catch (err) {
      console.error("Create default cart failed:", err);
    }
  };



  const handleSingleSubmit = async (name, email, image, googleid) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, image, googleid }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error);
      }
    } catch (err) {
      console.error("POST failed:", err);
    }
  };





  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Not authenticated</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-slate-900">
      <PromoBanner />
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12 md:py-20">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">
            My Account
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage your personal information and track your purchases.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Content */}
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-grow">
              {/* Pass the state here. If localUser is null, pass session user as fallback */}
              <UserDetailsSection user={localUser || session?.user} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

