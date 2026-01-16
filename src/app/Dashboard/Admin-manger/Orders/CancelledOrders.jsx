import React, { useEffect, useState, useContext, useCallback } from "react";
import { FaBan, FaSearch, FaEye, FaTrash, FaUndoAlt, FaShieldAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { AuthContext } from "../../../../Provider/AuthContext";
import axiosInstance from "../../../../utils/axiosInstance";

const CancelledOrders = () => {
  const { user: firebaseUser, loading: authLoading } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchUserData = async () => {
      if (!authLoading && firebaseUser?.email) {
        try {
          const response = await axiosInstance.get(`/users?email=${firebaseUser.email}`);
          if (response.data.result?.length > 0) {
            setDbUser(response.data.result[0]);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
    fetchUserData();
  }, [firebaseUser, authLoading]);


  const fetchCancelledOrders = useCallback(async (signal) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders`, {
        params: { email: searchTerm },
        signal: signal,
      });
      const cancelled = res.data.orders.filter(
        (order) => order.orderStatus === "cancelled"
      );
      setOrders(cancelled);
    } catch (error) {
      if (error.name !== "CanceledError") {
        Swal.fire("Error", "Failed to fetch records", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);


  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchCancelledOrders(controller.signal);
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchTerm, fetchCancelledOrders]);


  const handleRestore = async (id) => {
    const result = await Swal.fire({
      title: "Restore Order?",
      text: "This will move the order back to the pending queue.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      confirmButtonText: "Yes, Restore It",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, {
          orderStatus: "pending",
        });
        if (res.status === 200) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire({
            title: "Restored!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire("Error", "Restore operation failed", "error");
      }
    }
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Destruction?",
      text: "This data cannot be recovered after deletion!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete Permanently",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/orders/${id}`);
        if (res.data.result.deletedCount > 0) {
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire("Deleted!", "Record has been removed.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "Deletion failed", "error");
      }
    }
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="py-24 text-center">
         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mb-4"></div>
         <p className="font-black text-gray-300 uppercase tracking-widest text-xs">Synchronizing Database...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        
   
        <div className="bg-red-600 p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                <FaBan className="text-white/80" /> VOIDED ORDERS
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase flex items-center gap-1">
                  <FaShieldAlt size={8} /> {dbUser?.role || "Checking..."}
                </span>
                <span className="text-red-100 text-[10px] font-bold uppercase tracking-widest">
                  • {orders.length} Discarded Records
                </span>
              </div>
            </div>

            <div className="relative w-full md:w-80 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-200 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search by customer email..."
                className="bg-red-700/50 text-white placeholder-red-300 pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-white/30 w-full text-sm transition-all border border-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

   
        <div className="p-6">
          {orders.length === 0 ? (
            <div className="py-24 text-center">
               <FaBan className="mx-auto text-5xl text-gray-100 mb-4" />
               <p className="text-gray-400 font-bold uppercase tracking-widest">Zero Cancelled Records</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] px-6">
                    <th className="px-6 pb-2 text-left">Customer Profile</th>
                    <th className="px-6 pb-2 text-left">Voided Value</th>
                    <th className="px-6 pb-2 text-center">Administrative Control</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {orders.map((order) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -30 }}
                        key={order._id}
                        className="bg-white hover:shadow-md transition-shadow shadow-sm"
                      >
                        <td className="px-6 py-5 rounded-l-2xl border-y border-l border-gray-100">
                          <div className="font-bold text-gray-800 text-sm">{order.email}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">REF-{order._id.slice(-10).toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-5 border-y border-gray-100 font-black text-red-600">
                          ${order.total}
                        </td>
                        <td className="px-6 py-5 rounded-r-2xl border-y border-r border-gray-100">
                          <div className="flex justify-center gap-3">
                            <Link 
                              to={`/dashboard/admin/order-details/${order._id}`} 
                              title="View Snapshot"
                              className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-800 hover:text-white transition-all shadow-sm"
                            >
                              <FaEye size={14} />
                            </Link>

                   
                            {dbUser?.role !== "manager" && (
                              <>
                                <button 
                                  onClick={() => handleRestore(order._id)} 
                                  title="Restore to Pending"
                                  className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                >
                                  <FaUndoAlt size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(order._id)} 
                                  title="Delete Record"
                                  className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </>
                            )}
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

export default CancelledOrders;