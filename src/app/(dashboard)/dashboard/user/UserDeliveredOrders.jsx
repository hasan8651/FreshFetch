"use client";

import React, { useContext, useEffect, useState } from "react";
import { FaCheckDouble, FaSearch, FaEye, FaAward } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import Link from "next/link";
import { AuthContext } from "../../../Provider/AuthContext";

const UserDeliveredOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    try {

      const res = await axiosInstance.get(`/orders?email=${user?.email}`);
      const allOrders = res.data.orders || []; 
      const delivered = allOrders.filter((order) => order.orderStatus === "delivered");
      
      setOrders(delivered);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchDeliveredOrders();
    }
  }, [user?.email]);

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-600 text-white rounded-2xl shadow-lg shadow-green-100">
                 <FaCheckDouble size={20} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                Order History
              </h2>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest pl-1">
              Successfully received items
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className="bg-white pl-12 pr-5 py-4 rounded-3xl border border-gray-100 shadow-sm w-full outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/20 font-bold text-sm transition-all placeholder:text-gray-300" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>


        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-12 h-12 border-4 border-gray-100 border-t-green-600 rounded-full animate-spin"></div>
             <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Scanning Database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3.5rem] p-20 text-center shadow-sm border border-gray-50 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FaAward size={40} className="text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tighter italic">No Milestone Reached Yet</h3>
            <p className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest italic">Complete an order to see it here</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order._id}
                  className="bg-white p-8 rounded-[3rem] border border-transparent shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-green-200 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-500"
                >
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center text-2xl shadow-inner border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                      <FaCheckDouble />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg tracking-tighter uppercase">ID: #{order._id.slice(-10)}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                        Completed: {new Date(order.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-16 py-6 md:py-0 border-y md:border-y-0 border-gray-50/80">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Parcel</p>
                      <p className="text-base font-black text-gray-800">{order.products?.length || 0} Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Invested</p>
                      <p className="text-base font-black text-green-600 tracking-tighter">${order.total?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-indigo-100/50">
                       <FaAward size={12} /> Premium Purchase
                    </div>
                    <Link 
                      href={`/dashboard/user/order-details/${order._id}`} 
                      className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 transition-all shadow-xl hover:-translate-y-1 active:scale-90"
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

export default UserDeliveredOrders;