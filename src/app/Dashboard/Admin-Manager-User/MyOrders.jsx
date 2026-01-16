import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  FaEye,
  FaShoppingBag,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaSortAmountDown,
  FaCreditCard,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axiosInstance from "../../../utils/axiosInstance";
import { Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";

const getStatusInfo = (status) => {
  const configs = {
    pending: { icon: <FaClock />, color: "text-amber-600 bg-amber-50 border-amber-100" },
    shipped: { icon: <FaTruck />, color: "text-blue-600 bg-blue-50 border-blue-100" },
    delivered: { icon: <FaCheckCircle />, color: "text-green-600 bg-green-50 border-green-100" },
    default: { icon: <FaClock />, color: "text-gray-600 bg-gray-50 border-gray-100" }
  };
  return configs[status] || configs.default;
};

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchMyOrders = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders?email=${user?.email}`);
      const activeOrders = res.data.orders.filter(order => order.orderStatus !== "cancelled");
      setOrders(activeOrders);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [user?.email]);


  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [orders, sortOrder]);

  const handleCancelOrder = async (id) => {
    const result = await Swal.fire({
      title: "Cancel this order?",
      text: "This action will move your order to the cancelled list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Confirm Cancellation",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.patch(`/orders/${id}`, { orderStatus: "cancelled" });
        if (res.status === 200) {
          setOrders(prev => prev.filter(order => order._id !== id));
          Swal.fire({ icon: "success", title: "Cancelled", timer: 1500, showConfirmButton: false });
        }
      } catch (error) {
        Swal.fire("Error", "Could not process request", "error");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
 
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">My Purchases</h2>
            <p className="text-gray-500 text-sm font-medium">Track and manage your order journey</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-gray-50 pl-10 pr-8 py-3 rounded-2xl border-none font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="bg-indigo-50 px-5 py-3 rounded-2xl font-black text-indigo-700 flex items-center gap-2 text-sm">
              <FaShoppingBag /> {orders.length} Orders
            </div>
          </div>
        </header>


        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 w-full bg-white rounded-[2.5rem] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : sortedOrders.length === 0 ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <FaShoppingBag size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight">Your shopping bag is empty!</h3>
            <p className="text-gray-500 mt-2">Looks like you haven't made any purchases yet.</p>
            <Link to="/" className="mt-8 inline-block bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-indigo-100">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {sortedOrders.map((order) => {
                const status = getStatusInfo(order.orderStatus);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    key={order._id}
                    className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl hover:border-indigo-100 transition-all relative overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      
             
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl shadow-inner ${status.color}`}>
                          {status.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-gray-900 text-lg uppercase tracking-tighter">#{order._id.slice(-8)}</h4>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${status.color}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><FaCreditCard /> {order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

              
                      <div className="flex flex-1 items-center justify-around w-full lg:w-auto py-6 lg:py-0 border-y lg:border-y-0 lg:border-x border-gray-100">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                          <p className={`text-xs font-black uppercase ${order.paymentStatus === "paid" ? "text-green-500" : "text-amber-500"}`}>
                            {order.paymentStatus}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-xl font-black text-indigo-600">${order.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Link
                          to={`/dashboard/order-detailse/${order._id}`}
                          className="flex-1 lg:w-14 lg:h-14 py-4 lg:py-0 flex items-center justify-center bg-gray-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                        >
                          <FaEye size={18} />
                        </Link>
                        {order.orderStatus === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="flex-1 lg:w-14 lg:h-14 py-4 lg:py-0 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
                          >
                            <FaTimesCircle size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyOrders;