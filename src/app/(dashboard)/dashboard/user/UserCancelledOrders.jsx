"use client";

import React, { useEffect, useState } from "react";
import {
  FaRegFileAlt,
  FaSearch,
  FaEye,
  FaCalendarTimes,
  FaExclamationTriangle,
  FaHistory,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";

const UserCancelledOrders = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCancelledOrders = async () => {

      if (status !== "authenticated" || !session?.user?.email) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get(`/orders?email=${session.user.email}`);
        const cancelled = (res.data.orders || []).filter(
          (order) => order.orderStatus === "cancelled"
        );
        setOrders(cancelled);
      } catch (error) {
        console.error("Error loading cancelled orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
  }, [session?.user?.email, status]);

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBFC]">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-10 bg-[#FCFBFC] min-h-screen"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        
  
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-100">
                  <FaHistory size={20} />
               </div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                 Cancelled <span className="text-red-500">Archive</span>
               </h2>
            </div>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] pl-1">
              Records of voided or rejected transactions
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search Archive by ID..."
              className="bg-white pl-12 pr-5 py-4 rounded-3xl border border-gray-100 shadow-sm w-full outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/20 font-bold text-sm transition-all placeholder:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

      
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-12 h-12 border-4 border-gray-100 border-t-red-500 rounded-full animate-spin"></div>
             <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Scanning Vault...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3.5rem] p-20 text-center shadow-sm border border-gray-50 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <FaRegFileAlt size={40} className="text-red-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">No Cancellation Records</h3>
            <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest italic">Your order history is clean!</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order._id}
                  className="bg-white p-8 rounded-[3rem] border border-transparent shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-red-100 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-500"
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-2xl border border-red-50 group-hover:bg-red-500 group-hover:text-white transition-colors duration-500">
                      <FaCalendarTimes />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg tracking-tighter uppercase leading-none">
                        ORDER #{order._id.slice(-10).toUpperCase()}
                      </h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                        Terminated: {new Date(order.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-16 py-6 md:py-0 border-y md:border-y-0 border-gray-50">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                      <p className="text-base font-black text-gray-800">{order.products?.length || 0} Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Lost Value</p>
                      <p className="text-base font-black text-red-500 tracking-tighter">${order.total?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`flex-1 md:flex-none flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${
                      order.paymentStatus === "paid"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}>
                      <FaExclamationTriangle size={12} />
                      {order.paymentStatus === "paid" ? "Refund in Progress" : "No Action Needed"}
                    </div>
                    
                    <Link
                      href={`/dashboard/user/order-details/${order._id}`}
                      className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-500 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                    >
                      <FaEye size={20} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserCancelledOrders;