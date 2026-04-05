"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Box, Tags, DollarSign, Users, Settings, 
  ShoppingCart, Star, ChevronRight, Zap, Layers 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/adminSidebar/sidebar";

// --- Navigation Data ---
const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  {
    title: "Product",
    icon: Box,
    sub_items: [
      { title: "All Products", url: "/admin/allproduct" },
      { title: "Categories", url: "/admin/categorie" },
      { title: "Brands", url: "/admin/brand" },
      { title: "Tax rule", url: "/admin/taxrule" },
      { title: "Collection", url: "/admin/collection" },
      { title: "Attribute", url: "/admin/attribute" },
    ],
  },
  // { title: "Flash sales", url: "#", icon: Star },
  {
    title: "Orders",
    icon: DollarSign,
    sub_items: [
      { title: "Website Orders", url: "/admin/orders/websiteOrders" },
      { title: "POS Orders", url: "/admin/" },
    ],
  },
  { title: "Users", url: "/admin/user", icon: Users },
  { title: "Subscription", url: "/admin/subscription", icon: Layers },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const [openDropdown, setOpenDropdown] = useState(null);

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      // Added w-[var(--sidebar-width)] to force the container to honor the state
      className="fixed left-0 top-0 h-screen border-r border-gray-100 bg-white transition-[width] duration-300 ease-in-out z-40 w-[var(--sidebar-width)]" 
      collapsible="icon"
    >
      <SidebarContent className="bg-white px-2 group-data-[state=expanded]:px-4 py-6 overflow-x-hidden flex flex-col h-full">
        
        {/* Branding Area */}
        <div className="flex items-center gap-3 px-3 mb-10 shrink-0 h-8 overflow-hidden">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg">
            <Zap size={18} fill="currentColor" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-black uppercase tracking-tighter italic whitespace-nowrap"
              >
                Vantage Admin
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupContent className="flex flex-col gap-1">
            {items.map((item) => {
              const isParentActive = item.sub_items?.some(sub => pathname === sub.url);
              const isActive = pathname === item.url || isParentActive;

              if (item.sub_items) {
                return (
                  <div key={item.title} className="flex flex-col mb-1 overflow-hidden">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.title ? null : item.title)}
                      className={`flex items-center justify-between p-3 w-full rounded-xl transition-all duration-200 group/btn ${
                        (openDropdown === item.title || isParentActive) 
                          ? "bg-gray-50 text-black" 
                          : "text-gray-400 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className="shrink-0" />
                        {!isCollapsed && (
                          <span className="text-xs font-black uppercase tracking-widest truncate">
                            {item.title}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight 
                          size={14} 
                          className={`transition-transform duration-200 shrink-0 ${openDropdown === item.title ? "rotate-90" : ""}`} 
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.title && !isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden flex flex-col ml-9 border-l border-gray-100 mt-1"
                        >
                          {item.sub_items.map((sub) => (
                            <Link
                              key={sub.title}
                              href={sub.url}
                              className={`p-2.5 pl-5 text-[11px] font-bold transition-all rounded-r-lg whitespace-nowrap ${
                                pathname === sub.url 
                                  ? "text-black bg-gray-50 border-l-2 border-black" 
                                  : "text-gray-400 hover:text-black"
                              }`}
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center p-3 rounded-xl transition-all group/link overflow-hidden ${
                    isActive 
                      ? "bg-black text-white shadow-xl shadow-black/10" 
                      : "text-gray-400 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 text-xs font-black uppercase tracking-widest truncate">
                      {item.title}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  )}
                </Link>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer Card */}
        <div className="mt-auto px-2 shrink-0">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-6 border-t border-gray-50"
              >
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Status</p>
                  <p className="text-[10px] text-blue-400 font-bold leading-tight">Admin System v2.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

// --- Floating Trigger Component ---
export function FloatingSidebarTrigger() {
  const { toggleSidebar, state, isMobile } = useSidebar();
  const isOpen = state === "expanded";

  const leftClass = isMobile
    ? "left-4"
    : isOpen
    ? "left-[calc(var(--sidebar-width)-1.25rem)]" 
    : "left-[calc(var(--sidebar-width-icon)-1.25rem)]";

  return ( 
    <button
      onClick={toggleSidebar}
      className={`fixed top-20 z-[100] p-2.5 bg-black text-white rounded-full shadow-2xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-90 border-4 border-white ${leftClass}`}
    >
      <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
    </button>
  );
}