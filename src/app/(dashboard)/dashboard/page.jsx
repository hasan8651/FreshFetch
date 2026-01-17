"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";



import AdminStats from "./Admin/AdminStats";
import ManagerStats from "./Manager/ManagerStats";
import UserStats from "./User/UserStats";
import axiosInstance from "@/lib/axiosInstance";

const DashboardHome = () => {
  const { data: session, status } = useSession();
  const [dbUser, setDbUser] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const getRoleBasedData = async () => {

      if (status === "loading") return;

      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await axiosInstance.get(
            `/users?email=${session.user.email}`
          );
          if (response.data.result?.length > 0) {
            setDbUser(response.data.result[0]);
          }
        } catch (error) {
          console.error("Dashboard Data Fetch Error:", error);
        } finally {
          setFetching(false);
        }
      } else {
        setFetching(false);
      }
    };
    
    getRoleBasedData();
  }, [session?.user?.email, status]);

  if (status === "loading" || fetching) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="w-full h-full border-4 border-gray-100 rounded-full"></div>
          <div className="absolute top-0 w-full h-full border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
          Syncing Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      
 
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, <span className="text-green-600">{dbUser?.name || session?.user?.name || "Guest"}!</span>
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">
            Role: <span className="text-indigo-500">{dbUser?.role || "Visitor"}</span> • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-gray-500">System Live</span>
           </div>
        </div>
      </motion.div>

         <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {dbUser?.role === "admin" && <AdminStats dbUser={dbUser} />}
        {dbUser?.role === "manager" && <ManagerStats dbUser={dbUser} />}
        {dbUser?.role === "user" && <UserStats dbUser={dbUser} />}

            {!dbUser && status === "authenticated" && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <h2 className="text-2xl font-black text-gray-300 italic">
              User Data Not Synchronized
            </h2>
            <p className="text-gray-400 text-sm mt-2">Please contact system administrator for access permissions.</p>
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default DashboardHome;