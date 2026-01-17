"use client";

import React, { useEffect, useState } from "react";
import { FiPackage, FiAlertCircle, FiTruck, FiStar, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";


import axiosInstance from "@/lib/axiosInstance";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";
import ManagerCategoryChart from "@/components/dashboard/ManagerCategoryChart";
import ManagerStockPieChart from "@/components/dashboard/ManagerStockPieChart";
import TopSellingProducts from "@/components/dashboard/TopSellingProducts";

const ManagerStats = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    products: [],
    orders: [],
    stats: {
      totalProducts: 0,
      outOfStock: 0,
      pendingOrders: 0,
      avgRating: 0
    }
  });

  useEffect(() => {
    const fetchManagerData = async () => {
  
      if (status === "loading") return;

      try {
        const [productRes, orderRes] = await Promise.all([
          axiosInstance.get("/products?limit=1000"),
          axiosInstance.get("/orders?limit=1000")
        ]);

        const allProducts = productRes.data.products || [];
        const allOrders = orderRes.data.orders || [];

        const outOfStock = allProducts.filter(p => p.stock === 0).length;
        const pendingOrders = allOrders.filter(o => o.orderStatus === "pending").length;
        const totalRating = allProducts.reduce((sum, p) => sum + (p.rating || 0), 0);
        const avgRating = allProducts.length > 0 ? (totalRating / allProducts.length).toFixed(1) : 0;

        setData({
          products: allProducts,
          orders: allOrders,
          stats: {
            totalProducts: productRes.data.totalProducts || allProducts.length,
            outOfStock,
            pendingOrders,
            avgRating
          }
        });
      } catch (error) {
        console.error("Error fetching manager analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [status]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Assembling Dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
                <FiActivity size={20} />
             </div>
             <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Overview</h2>
          </div>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 ml-1">
            Manager: <span className="text-indigo-600">{session?.user?.name || 'System Admin'}</span>
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">System Health</p>
           <p className="text-sm font-black text-green-500 text-center uppercase tracking-tighter mt-1">● Optimal</p>
        </div>
      </header>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Products", value: data.stats.totalProducts, icon: <FiPackage />, color: "bg-blue-500", shadow: "shadow-blue-100" },
          { label: "Out of Stock", value: data.stats.outOfStock, icon: <FiAlertCircle />, color: "bg-rose-500", shadow: "shadow-rose-100" },
          { label: "Pending Orders", value: data.stats.pendingOrders, icon: <FiTruck />, color: "bg-amber-500", shadow: "shadow-amber-100" },
          { label: "Avg Rating", value: `${data.stats.avgRating}/5`, icon: <FiStar />, color: "bg-emerald-500", shadow: "shadow-emerald-100" },
        ].map((stat, index) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={index} 
            className="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden group transition-all"
          >
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex flex-col gap-5 relative z-10">
              <div className={`w-14 h-14 ${stat.color} text-white rounded-[1.5rem] flex items-center justify-center text-2xl shadow-2xl ${stat.shadow}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 border-b border-gray-50 pb-5">Order Distribution</h4>
            <OrderStatusChart orders={data.orders} />
        </section>

        <section className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 border-b border-gray-50 pb-5">Product Categories</h4>
            <ManagerCategoryChart products={data.products} />
        </section>

        <section className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 border-b border-gray-50 pb-5">Inventory Health</h4>
            <ManagerStockPieChart stats={data.stats} products={data.products} />
        </section>

        <section className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 border-b border-gray-50 pb-5">Top Performing Products</h4>
            <TopSellingProducts orders={data.orders} />
        </section>
      </div>
    </motion.div>
  );
};

export default ManagerStats;