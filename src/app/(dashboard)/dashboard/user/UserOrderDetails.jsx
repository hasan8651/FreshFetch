"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCreditCard,
  FaReceipt,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaPrint,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";


const UserOrderDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
          if (status === "loading") return;
      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await axiosInstance.get(`/orders/${id}`);
           if (res.data.userEmail && res.data.userEmail !== session?.user?.email) {
          console.error("Unauthorized access to this order.");
          router.push("/dashboard/user/my-orders");
          return;
        }

        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
    window.scrollTo(0, 0);
  }, [id, status, session?.user?.email, router]);

  const getStatusStep = (currentStatus) => {
    const steps = ["pending", "shipped", "delivered"];
    const index = steps.indexOf(currentStatus?.toLowerCase());
    return index === -1 ? 0 : index;
  };

  if (loading || status === "loading")
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
        <p className="font-black text-gray-300 uppercase tracking-widest animate-pulse">
          Generating Your Invoice...
        </p>
      </div>
    );

  if (!order)
    return (
      <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest">
        Order not found in our records!
      </div>
    );

  const currentStep = getStatusStep(order.orderStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 bg-[#FDFDFD] min-h-screen print:bg-white print:p-0"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-black text-[10px] uppercase tracking-widest transition-all mb-4"
            >
              <FaArrowLeft /> Back to Purchases
            </button>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              Invoice <span className="text-green-600">#{order._id.slice(-10)}</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
              Issued on: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              <FaPrint className="text-gray-400" /> Print
            </button>
            <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase border shadow-sm flex items-center ${
              order.orderStatus === "cancelled" ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
            }`}>
              Status: {order.orderStatus}
            </span>
          </div>
        </header>

    
        {order.orderStatus !== "cancelled" && (
          <section className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 print:hidden">
            <div className="flex justify-between items-center relative max-w-3xl mx-auto">
               <div className="absolute h-1 bg-gray-100 w-full top-1/2 -translate-y-1/2 z-0 rounded-full" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 2) * 100}%` }}
                className="absolute h-1 bg-green-500 top-1/2 -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
              />

              {[
                { label: "Confirmed", icon: <FaClock /> },
                { label: "Shipped", icon: <FaTruck /> },
                { label: "Delivered", icon: <FaCheckCircle /> },
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
                  <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-xl transition-all duration-500 shadow-xl ${
                    idx <= currentStep ? "bg-green-600 text-white shadow-green-100 ring-4 ring-green-50" : "bg-white text-gray-200 border border-gray-100"
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${idx <= currentStep ? "text-green-600" : "text-gray-300"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-10 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FaReceipt className="text-green-600" />
                    <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest">Your Items</h3>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase">{order.products?.length || 0} Items</span>
              </div>
              
              <div className="divide-y divide-gray-50">
                {order.products?.map((item, index) => (
                  <div key={index} className="p-8 md:p-10 flex items-center gap-8 group hover:bg-gray-50/50 transition-colors">
                    <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <Image src={item.image} alt={item.name} unoptimized className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900 text-xl tracking-tighter leading-none">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase mt-2 tracking-widest">
                        {item.category} • {item.unit}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-gray-400 font-bold text-sm">
                          ${item.price?.toFixed(2)} <span className="text-green-600 font-black mx-2">×</span> {item.quantity}
                        </span>
                        <span className="text-gray-900 font-black text-xl tracking-tighter">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

               <div className="p-10 bg-gray-900 text-white flex justify-between items-center rounded-b-[3.5rem]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400">Total Amount Paid</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Inclusive of all taxes & shipping</p>
                </div>
                <p className="text-5xl font-black tracking-tighter">${order.total?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
       
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest mb-8 flex items-center gap-2 border-b border-gray-50 pb-5">
                <FaMapMarkerAlt className="text-green-500" /> Delivery To
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Address</label>
                  <p className="text-sm font-black text-gray-800 leading-relaxed mt-2 uppercase tracking-tight">
                    {order.shippingAddress?.address}
                  </p>
                  <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">
                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode || "N/A"}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <p className="text-sm font-black text-gray-800 mt-1 tracking-widest">
                    {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>
            </div>

    
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-800 uppercase text-[10px] tracking-widest mb-8 flex items-center gap-2 border-b border-gray-50 pb-5">
                <FaCreditCard className="text-indigo-500" /> Payment Info
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</span>
                  <span className="text-[10px] font-black text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${
                    order.paymentStatus === "paid" ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                {order.transactionId && (
                  <div className="mt-6 pt-6 border-t border-gray-50">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Transaction ID</p>
                    <p className="text-[9px] font-mono font-bold text-gray-500 break-all bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 text-center select-all cursor-pointer">
                      {order.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

  
        <div className="hidden print:block text-center pt-20 border-t border-gray-100">
           <p className="text-xl font-black text-green-600">FreshFetch Organic Store</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Thank you for shopping with us!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default UserOrderDetails;