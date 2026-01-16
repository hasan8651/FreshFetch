"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, CreditCard, Clock, CheckCircle2 } from "lucide-react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/my-orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Orders fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-300">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >
 
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Transaction ID</p>
                    <p className="text-sm font-mono text-indigo-600">{order.transactionId}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold">
                    <CheckCircle2 size={14} />
                    Paid via {order.paymentMethod}
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-center">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Date:</span>
                        <span className="text-gray-800 text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="font-bold text-gray-900">Total Paid:</span>
                        <span className="font-black text-indigo-600 text-lg">${order.total.toFixed(2)}</span>
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