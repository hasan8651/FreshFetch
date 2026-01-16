import React, { useEffect, useState, useCallback } from "react";
import {
  FaTrash,
  FaTruck,
  FaBan,
  FaSearch,
  FaEye,
  FaWallet,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axiosInstance from "../../../../utils/axiosInstance";
import { Link } from "react-router";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = useCallback(async (signal) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
        signal: signal,
      });

      const pendingOrders = res.data.orders
        .filter((order) => order.orderStatus === "pending")
        .sort((a, b) => {
          if (a.paymentStatus === "paid" && b.paymentStatus !== "paid") return -1;
          if (a.paymentStatus !== "paid" && b.paymentStatus === "paid") return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

      setOrders(pendingOrders);
      setCurrentPage(1);
    } catch (error) {
      if (error.name !== "CanceledError") {
        Swal.fire("Error", "Failed to fetch orders", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);


  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchOrders(controller.signal);
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchTerm, fetchOrders]);


  const updateStatus = async (id, newStatus) => {
    const actionText = newStatus === "shipped" ? "Ship this order?" : "Cancel this order?";
    const confirmButtonColor = newStatus === "shipped" ? "#10B981" : "#EF4444";

    const result = await Swal.fire({
      title: actionText,
      text: "This action will update the order status immediately.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Update",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: newStatus,
        });
        if (res.status === 200) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Order status changed to ${newStatus}`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update order", "error");
      }
    }
  };


  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        

        <div className="bg-gray-900 p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-amber-500 animate-ping"></span>
                PENDING QUEUE
              </h2>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
                Awaiting Verification • {orders.length} Units
              </p>
            </div>

            <div className="relative w-full md:w-96 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by customer email..."
                className="bg-gray-800 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/50 w-full text-sm transition-all border border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>


        <div className="p-6">
          {loading ? (
            <div className="py-24 text-center">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mb-4"></div>
               <p className="font-black text-gray-300 uppercase tracking-widest text-xs">Scanning Orders...</p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="py-24 text-center">
               <FaBan className="mx-auto text-5xl text-gray-100 mb-4" />
               <p className="text-gray-400 font-bold uppercase tracking-widest">No Pending Orders</p>
            </div>
          ) : (
            <>
    
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] px-6">
                      <th className="px-6 pb-2 text-left">Customer Info</th>
                      <th className="px-6 pb-2 text-left">Payment Details</th>
                      <th className="px-6 pb-2 text-center">Status</th>
                      <th className="px-6 pb-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginatedOrders.map((order) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          key={order._id}
                          className="bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <td className="px-6 py-5 rounded-l-2xl border-y border-l border-gray-100">
                            <p className="font-bold text-gray-800 text-sm">{order.email}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase tracking-tighter">ORD-{order._id.slice(-10)}</p>
                          </td>
                          <td className="px-6 py-5 border-y border-gray-100">
                            <p className="text-sm font-black text-indigo-600">${order.total}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{order.paymentMethod}</p>
                          </td>
                          <td className="px-6 py-5 border-y border-gray-100 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                              order.paymentStatus === "paid"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-amber-50 text-amber-600 border-amber-100 animate-pulse"
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-5 rounded-r-2xl border-y border-r border-gray-100">
                            <div className="flex justify-center gap-3">
                              <Link to={`/dashboard/admin/order-details/${order._id}`} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <FaEye size={14} />
                              </Link>
                              <button onClick={() => updateStatus(order._id, "shipped")} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Ship Now">
                                <FaTruck size={14} />
                              </button>
                              <button onClick={() => updateStatus(order._id, "cancelled")} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Cancel Order">
                                <FaBan size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

    
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                {paginatedOrders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xs font-black text-gray-800 truncate w-40">{order.email}</h4>
                        <p className="text-[10px] text-indigo-600 font-bold mt-1">${order.total} • {order.paymentMethod}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-50">
                      <Link to={`/dashboard/admin/order-details/${order._id}`} className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl flex justify-center"><FaEye /></Link>
                      <button onClick={() => updateStatus(order._id, "shipped")} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl flex justify-center"><FaTruck /></button>
                      <button onClick={() => updateStatus(order._id, "cancelled")} className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl flex justify-center"><FaBan /></button>
                    </div>
                  </div>
                ))}
              </div>

     
              <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, orders.length)} of {orders.length} Orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="p-3 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          currentPage === i + 1 ? "bg-gray-900 text-white shadow-lg" : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-3 bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageOrders;