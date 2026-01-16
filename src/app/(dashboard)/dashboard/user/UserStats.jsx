"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { 
  FiHeart, FiPackage, FiCreditCard, FiShoppingBag, 
  FiUser, FiActivity, FiArrowUpRight 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";
import axiosInstance from "../../../utils/axiosInstance";
import { AuthContext } from "../../../Provider/AuthContext";

const UserStats = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

   const spendingData = [
    { month: "Jan", amount: 45 }, { month: "Feb", amount: 120 },
    { month: "Mar", amount: 78 }, { month: "Apr", amount: 210 },
    { month: "May", amount: 145 }, { month: "Jun", amount: 190 },
  ];

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.email) return;
      try {
        const res = await axiosInstance.get(`/orders?email=${user.email}`);
        setOrders(res.data.orders || []);
        setTotalOrderCount(res.data.totalOrder || 0);
      } catch (error) {
        console.error("User Stats Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, [user?.email]);

  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.paymentStatus === "paid" ? order.total : 0),
    0
  );

  const growthRate = totalOrderCount > 0 ? ((totalOrderCount / 10) * 100).toFixed(0) : 0;

  if (loading) {
    return <div className="h-96 w-full bg-gray-50 animate-pulse rounded-[3rem]" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 p-1 md:p-4"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Overview</h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Real-time account activity</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-green-600 flex items-center justify-center text-white font-black shadow-lg shadow-green-100">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Verified Member</p>
            <p className="text-xs font-bold text-gray-700">{user?.email}</p>
          </div>
        </div>
      </header>

      <section className="bg-gray-900 p-8 md:p-14 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center shadow-2xl shadow-gray-200 relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <span className="bg-green-500/20 text-green-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-500/30 backdrop-blur-md">
            Customer Profile: Premium
          </span>
          <h3 className="text-4xl md:text-6xl font-black leading-none tracking-tighter uppercase">
            Verified <br /> Store Partner
          </h3>
          <p className="opacity-50 font-medium max-w-sm text-sm leading-relaxed">
            You've successfully completed {totalOrderCount} orders. Your loyalty is what keeps us growing!
          </p>
        </div>
        <div className="mt-8 md:mt-0 relative z-10">
          <Link href="/dashboard/profile">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 transition-colors shadow-2xl"
            >
              Edit Profile Settings
            </motion.button>
          </Link>
        </div>
        <FiShoppingBag className="absolute -right-16 -bottom-16 text-white opacity-[0.03] w-96 h-96 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
      </section>


      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<FiPackage />} label="Total Orders" value={totalOrderCount} color="blue" growth={`${growthRate}%`} />
        <StatCard icon={<FiHeart />} label="Wishlist" value="0" color="pink" />
        <StatCard icon={<FiCreditCard />} label="Lifetime Spent" value={`$${totalSpent.toFixed(2)}`} color="orange" />
      </section>


      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <h4 className="text-sm font-black text-gray-800 mb-8 uppercase tracking-widest flex items-center gap-2">
            <FiActivity className="text-green-500" /> Expense Analysis
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fill="url(#colorSpent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <FiPackage className="text-blue-500" /> Recent Purchases
            </h4>
            <Link href="/dashboard/user/my-orders" className="text-[10px] font-black text-gray-400 hover:text-green-600 transition-colors uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};



const StatCard = ({ icon, label, value, color, growth }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 flex items-center gap-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className={`p-5 rounded-3xl transition-colors ${
      color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 
      color === 'pink' ? 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white' : 
      'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
    }`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.15em] mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <h5 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h5>
        {growth && <span className="text-green-500 text-[10px] font-black flex items-center tracking-tighter">+{growth}</span>}
      </div>
    </div>
  </div>
);

const OrderRow = ({ order }) => (
  <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-lg transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${order.orderStatus === "delivered" ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
      <div>
        <p className="text-xs font-black text-gray-900 uppercase">Order #{order._id.slice(-6)}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-black text-gray-900">${order.total}</p>
      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
        order.paymentStatus === "paid" ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
      }`}>
        {order.paymentStatus}
      </span>
    </div>
  </div>
);

export default UserStats;