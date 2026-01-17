"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const MyOrdersPage = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.email) return;
      
      try {
            const res = await fetch(`/api/orders?email=${session.user.email}`);
        const data = await res.json();
        
            setOrders(data.orders || []); 
      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Loading Your Orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">No orders found in your history.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
        
                <div className="bg-gray-50/80 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Transaction ID</p>
                    <p className="text-sm font-mono font-bold text-indigo-600">{order.transactionId || "N/A"}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    <CheckCircle2 size={12} />
                    {order.paymentStatus} via {order.paymentMethod}
                  </div>
                </div>

      
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                             <Image 
                               src={item.image || "/placeholder.png"} 
                               alt={item.name} 
                               fill 
                               className="object-cover group-hover:scale-110 transition-transform" 
                             />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800 uppercase">{item.name}</p>
                            <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity} × ${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-indigo-50/30 rounded-[1.5rem] p-6 flex flex-col justify-center border border-indigo-50">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Order Date</span>
                        <span className="text-gray-800 text-sm font-bold">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-indigo-100 pt-4 mt-2">
                        <span className="font-black text-gray-900 text-xs uppercase tracking-widest">Total Paid</span>
                        <span className="font-black text-indigo-600 text-2xl">${order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;