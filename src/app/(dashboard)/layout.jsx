"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoGridOutline, IoCubeOutline, IoCartOutline, 
  IoPeopleOutline, IoSettingsOutline, IoLogOutOutline,
  IoMenuOutline, IoCloseOutline, IoNotificationsOutline 
} from "react-icons/io5";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: <IoGridOutline />, path: "/dashboard" },
    { name: "Inventory", icon: <IoCubeOutline />, path: "/dashboard/inventory" },
    { name: "Orders", icon: <IoCartOutline />, path: "/dashboard/orders" },
    { name: "Customers", icon: <IoPeopleOutline />, path: "/dashboard/customers" },
    { name: "Settings", icon: <IoSettingsOutline />, path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFE] flex">
      <Toaster position="top-right" />

      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-72" : "w-20"} hidden lg:flex flex-col`}
      >
        <div className="p-8 flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-green-100">
             <IoCubeOutline size={24} />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-black tracking-tighter text-gray-900">
              Fresh<span className="text-green-600">Fetch</span>
            </span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path}>
                <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                  ${isActive 
                    ? "bg-green-600 text-white shadow-xl shadow-green-100" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-widest">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
           <button className="flex items-center gap-4 px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 w-full rounded-2xl transition-colors">
              <IoLogOutOutline size={22} />
              {isSidebarOpen && <span className="text-sm uppercase tracking-widest">Logout</span>}
           </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}>
        
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
            >
              {isSidebarOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
            </button>
            <h2 className="text-lg font-black text-gray-800 hidden md:block">
              {menuItems.find(item => item.path === pathname)?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all">
              <IoNotificationsOutline size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:ring-2 ring-green-500 transition-all">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;