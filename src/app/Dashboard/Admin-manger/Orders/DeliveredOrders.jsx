import React, { useEffect, useState, useCallback } from "react";
import { FaCheckDouble, FaSearch, FaEye, FaAward, FaHistory } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router";
import axiosInstance from "../../../../utils/axiosInstance";

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDeliveredOrders = useCallback(async (signal) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
        signal: signal,
      });

  
      const delivered = res.data.orders
        .filter((order) => order.orderStatus === "delivered")
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

      setOrders(delivered);
    } catch (error) {
      if (error.name !== "CanceledError") {
        Swal.fire("Error", "Could not retrieve delivery history", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchDeliveredOrders(controller.signal);
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchTerm, fetchDeliveredOrders]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        
 
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <FaCheckDouble className="drop-shadow-md" /> 
                DELIVERY ARCHIVE
              </h2>
              <p className="text-green-50 text-[10px] uppercase font-bold tracking-[0.2em] mt-1 opacity-90">
                Completed Transactions • {orders.length} Records
              </p>
            </div>

            <div className="relative w-full md:w-96 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-200 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search by customer email..."
                className="bg-green-700/40 text-white placeholder-green-200 pl-12 pr-4 py-3.5 rounded-2xl outline-none border border-green-400/30 focus:border-white w-full transition-all backdrop-blur-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

   
        <div className="p-6">
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
              <p className="font-black text-gray-300 uppercase tracking-widest text-xs">Accessing Archives...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                <FaAward size={40} />
              </div>
              <div>
                <h3 className="text-gray-400 font-bold uppercase tracking-widest">No History Found</h3>
                <p className="text-gray-300 text-xs mt-1">Orders appear here once they are marked as delivered.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] px-6">
                    <th className="px-6 pb-2 text-left">Recipient</th>
                    <th className="px-6 pb-2 text-left">Revenue</th>
                    <th className="px-6 pb-2 text-center">Payment Status</th>
                    <th className="px-6 pb-2 text-center">Archive View</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {orders.map((order) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={order._id}
                        className="bg-white hover:shadow-md transition-shadow group"
                      >
                        <td className="px-6 py-5 rounded-l-2xl border-y border-l border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                               <FaHistory size={12} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{order.email}</p>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-tighter">ID: #{order._id.slice(-10)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 border-y border-gray-100">
                          <p className="text-sm font-black text-emerald-600">${order.total}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Cleared</p>
                        </td>
                        <td className="px-6 py-5 border-y border-gray-100 text-center">
                          <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                             {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-5 rounded-r-2xl border-y border-r border-gray-100 text-center">
                          <Link
                            to={`/dashboard/admin/order-details/${order._id}`}
                            className="inline-flex w-10 h-10 items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                          >
                            <FaEye size={14} />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveredOrders;