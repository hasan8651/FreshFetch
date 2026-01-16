"use client";

import React, { useEffect, useState } from "react";
import { FiUsers, FiShoppingBag, FiDollarSign, FiBox, FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import Link from "next/link";

import RevenueDonutChart from "../../../components/AdminComponents/RevenueDonutChart";
import UserProgressChart from "../../../components/AdminComponents/UserProgressChart";
import OrderDonutChart from "../../../components/AdminComponents/OrderDonutChart";
import ProductPieChart from "../../../components/AdminComponents/ProductPieChart";

const AdminStats = () => {
  const [data, setData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userRes, productRes, orderRes] = await Promise.all([
          axiosInstance.get("/users"),
          axiosInstance.get("/products"),
          axiosInstance.get("/orders"),
        ]);

        const allOrders = orderRes.data.orders || [];

         const totalRevenue = allOrders
          .filter((order) => order.paymentStatus === "paid")
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setOrders(allOrders);

        setData({
          users: userRes.data.totalUsers || 0,
          products: productRes.data.totalProducts || 0,
          orders: orderRes.data.totalOrder || allOrders.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching admin analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const statsConfig = [
    {
      label: "Revenue",
      value: `$${data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: <FiDollarSign size={22} />,
      color: "bg-emerald-500",
      shadow: "shadow-emerald-100",
    },
    {
      label: "Users",
      value: data.users.toLocaleString(),
      icon: <FiUsers size={22} />,
      color: "bg-blue-500",
      shadow: "shadow-blue-100",
    },
    {
      label: "Orders",
      value: data.orders,
      icon: <FiShoppingBag size={22} />,
      color: "bg-indigo-500",
      shadow: "shadow-indigo-100",
    },
    {
      label: "Products",
      value: data.products.toLocaleString(),
      icon: <FiBox size={22} />,
      color: "bg-orange-500",
      shadow: "shadow-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-gray-100 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Syncing Analytics...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
            Admin <span className="text-emerald-600">Stats</span>
          </h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 italic">
            Platform-wide Transactional Data
          </p>
        </div>
        <div className="hidden md:block bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-black text-[10px] text-gray-500 uppercase tracking-widest">
           Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <motion.div
            whileHover={{ y: -5 }}
            key={index}
            className="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
          >
            <div className="flex flex-col gap-5">
              <div className={`w-14 h-14 ${stat.color} text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl ${stat.shadow} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-400 font-black text-[9px] uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </p>
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                      {stat.value}
                    </h3>
                    <FiArrowUpRight className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-50 shadow-sm">
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 border-b pb-4">Revenue Breakdown</h4>
           <RevenueDonutChart totalRevenue={data.revenue} />
        </div>
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 border-b pb-4">User Growth</h4>
           <UserProgressChart totalUsers={data.users} />
        </div>
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 border-b pb-4">Order Status Metrics</h4>
           <OrderDonutChart orders={orders} />
        </div>
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 border-b pb-4">Product Inventory Share</h4>
           <ProductPieChart totalProducts={data.products} />
        </div>
      </div>

       <div className="bg-[#10B981] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">
              Inventory Status: <span className="text-emerald-200 italic">Healthy</span>
            </h3>
            <p className="text-emerald-50 font-bold text-sm max-w-xl opacity-90">
              You currently manage {data.products} active products. Maintaining a diverse inventory increases customer retention and average order value.
            </p>
          </div>
          <Link href="/dashboard/admin/manage-products" className="group flex items-center justify-center gap-3 px-10 py-5 bg-white text-emerald-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-50 transition-all shadow-lg active:scale-95">
            Catalog Management <FiBox className="group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
         <FiBox className="absolute -bottom-16 -right-16 text-white/10 w-80 h-80 rotate-12" />
      </div>
    </motion.div>
  );
};

export default AdminStats;