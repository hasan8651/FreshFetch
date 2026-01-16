import React, { useEffect, useState, useCallback } from "react";
import { FaCheckCircle, FaSearch, FaEye, FaBoxOpen, FaTruckLoading } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router";
import axiosInstance from "../../../../utils/axiosInstance";

const ShippedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  
  const fetchShippedOrders = useCallback(async (signal) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
        signal: signal
      });


      const shipped = res.data.orders.filter(
        (order) => order.orderStatus === "shipped"
      );
      setOrders(shipped);
    } catch (error) {
      if (error.name !== "CanceledError") {
        Swal.fire("Error", "Could not load orders. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);


  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchShippedOrders(controller.signal);
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchTerm, fetchShippedOrders]);


  const markAsDelivered = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Delivery?",
      text: "Is this package successfully reached the customer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Delivered!",
      borderRadius: "15px"
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: "delivered",
        });
        
        if (res.status === 200) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          toast.success("Order marked as delivered!");
        }
      } catch (error) {
        Swal.fire("Failed", "Update operation failed on server", "error");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        

        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-4xl font-black flex items-center gap-3">
                <FaBoxOpen /> SHIPPED ORDERS
              </h2>
              <p className="text-blue-100 text-xs font-bold tracking-[0.2em] mt-2 opacity-80">
                TRANSIT LOGISTICS • {orders.length} ACTIVE SHIPMENTS
              </p>
            </div>

            <div className="relative w-full md:w-96 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search customer email..."
                className="bg-blue-800/50 text-white placeholder-blue-300 pl-12 pr-4 py-4 rounded-2xl outline-none border border-blue-400/30 focus:border-white w-full transition-all backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>


        <div className="p-6">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <FaTruckLoading className="text-5xl text-blue-500 animate-bounce" />
              <span className="font-black text-gray-300 tracking-widest uppercase text-sm">Synchronizing Shipments...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-32 text-center">
              <div className="text-gray-200 text-7xl mb-4 flex justify-center"><FaBoxOpen /></div>
              <h3 className="text-gray-400 font-bold text-xl uppercase tracking-tighter">No active shipments found</h3>
              <p className="text-gray-400 text-sm mt-1">All orders are either delivered or pending.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
                    <th className="px-6 pb-2">Tracking Details</th>
                    <th className="px-6 pb-2">Value</th>
                    <th className="px-6 pb-2 text-center">Status</th>
                    <th className="px-6 pb-2 text-center">Operation</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {orders.map((order) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={order._id}
                        className="bg-white hover:bg-blue-50/30 transition-colors group shadow-sm"
                      >
                        <td className="px-6 py-5 rounded-l-2xl border-y border-l border-gray-100">
                          <p className="font-bold text-gray-800">{order.email}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">ID: #{order._id.slice(-12).toUpperCase()}</p>
                        </td>
                        <td className="px-6 py-5 border-y border-gray-100">
                          <p className="text-lg font-black text-blue-600">${order.total}</p>
                          <p className="text-[9px] text-gray-400 uppercase font-bold">Standard Shipping</p>
                        </td>
                        <td className="px-6 py-5 border-y border-gray-100 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                              order.paymentStatus === "paid" 
                              ? "bg-green-50 text-green-600 border-green-100" 
                              : "bg-orange-50 text-orange-600 border-orange-100"
                           }`}>
                            {order.paymentStatus}
                           </span>
                        </td>
                        <td className="px-6 py-5 rounded-r-2xl border-y border-r border-gray-100">
                          <div className="flex justify-center gap-3">
                            <Link
                              to={`/dashboard/admin/order-details/${order._id}`}
                              className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                              title="View Invoice"
                            >
                              <FaEye />
                            </Link>
                            <button
                              onClick={() => markAsDelivered(order._id)}
                              className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-md"
                              title="Mark as Received"
                            >
                              <FaCheckCircle />
                            </button>
                          </div>
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

export default ShippedOrders;