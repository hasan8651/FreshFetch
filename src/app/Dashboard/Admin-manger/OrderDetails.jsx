import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaArrowLeft, FaBox, FaRegAddressCard, FaCreditCard,
  FaUser, FaCheckCircle, FaCopy, FaClock, FaHistory
} from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import Image from "next/image";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: `${label} Copied!`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      icon: 'success'
    });
  };

  const fetchOrderDetails = async () => {
    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      Swal.fire("Error", "Could not fetch order data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleUpdateStatus = async (field, value) => {
    const result = await Swal.fire({
      title: `Update ${field}?`,
      text: `Are you sure you want to change this to ${value.toUpperCase()}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
    });

    if (result.isConfirmed) {
      try {
        const updateData = { [field]: value, updatedBy: user?.email };
        await axiosInstance.patch(`/orders/${id}`, updateData);
        Swal.fire("Success", "Order updated successfully", "success");
        fetchOrderDetails();
      } catch (error) {
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  const statusMap = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    shipped: "text-blue-600 bg-blue-50 border-blue-100",
    delivered: "text-green-600 bg-green-50 border-green-100",
    cancelled: "text-red-600 bg-red-50 border-red-100",
    paid: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Fetching Order Details...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-[10px] uppercase tracking-widest transition-all">
              <FaArrowLeft /> Back to List
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">ORDER #{order._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => copyToClipboard(order._id, 'Order ID')} className="text-gray-300 hover:text-indigo-500 transition-colors">
                <FaCopy size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <FaClock className="text-indigo-400" /> {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select 
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase border cursor-pointer focus:ring-4 focus:ring-indigo-100 outline-none transition-all ${statusMap[order.orderStatus]}`}
              value={order.orderStatus}
              onChange={(e) => handleUpdateStatus('orderStatus', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest flex items-center gap-3">
                   <FaBox className="text-indigo-600" /> Order Items ({order.products?.length})
                 </h3>
                 <span className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                   Invoice Generated
                 </span>
              </div>

              <div className="divide-y divide-gray-50">
                {order.products?.map((item, idx) => (
                  <div key={idx} className="p-10 flex flex-col sm:flex-row items-center gap-8 hover:bg-gray-50/50 transition-all">
                    <Image src={item.image} className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white shadow-lg shrink-0" unoptimized alt={item.name} />
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-black text-gray-900 text-xl leading-tight mb-1">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{item.category} | SKU: {item._id?.slice(-5)}</p>
                      <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                         <span className="text-indigo-600 font-black text-lg">${item.price}</span>
                         <span className="text-gray-300 font-black text-xs">x</span>
                         <span className="text-gray-900 font-black text-lg bg-gray-100 px-4 py-1 rounded-xl">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                       ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

                
              <div className="p-10 bg-indigo-900 text-white">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-indigo-300 font-black uppercase text-[10px] tracking-widest">Grand Total Amount</p>
                      <h2 className="text-5xl font-black">${order.total?.toFixed(2)}</h2>
                   </div>
                   <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase border-2 ${order.paymentStatus === 'paid' ? 'border-emerald-400 text-emerald-400' : 'border-amber-400 text-amber-400 animate-pulse'}`}>
                      {order.paymentStatus}
                   </div>
                </div>
              </div>
            </div>
          </div>

 
          <div className="space-y-8">
   
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[4rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
               <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-3 relative z-10">
                 <FaUser className="text-green-500" /> Recipient Details
               </h3>
               <div className="space-y-5 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-indigo-600">{order.shippingAddress?.fullName[0]}</div>
                     <div>
                        <p className="text-sm font-black text-gray-900">{order.shippingAddress?.fullName}</p>
                        <p className="text-[10px] font-bold text-indigo-600 lowercase">{order.email}</p>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-gray-50">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Phone</p>
                     <p className="text-sm font-bold text-gray-800">{order.shippingAddress?.phone}</p>
                  </div>
               </div>
            </div>

  
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-3">
                 <FaRegAddressCard className="text-blue-500" /> Logistics
               </h3>
               <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-600 leading-relaxed mb-4">{order.shippingAddress?.address}</p>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                     <span>City: <span className="text-gray-900">{order.shippingAddress?.city}</span></span>
                     <span className="bg-white px-2 py-1 rounded-md shadow-sm">Zip: {order.shippingAddress?.zipCode || 'N/A'}</span>
                  </div>
               </div>
            </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-6 flex items-center gap-3">
                 <FaCreditCard className="text-purple-500" /> Payment Audit
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                     <span className="text-[10px] font-black text-gray-400 uppercase">Method</span>
                     <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{order.paymentMethod}</span>
                  </div>
                  
                  {order.paymentStatus === 'pending' && (
                    <button 
                      onClick={() => handleUpdateStatus('paymentStatus', 'paid')}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                    >
                      Verify Payment
                    </button>
                  )}

                  {order.transactionId && (
                    <div className="pt-4 border-t border-gray-50">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                         TXN HASH
                         <button onClick={() => copyToClipboard(order.transactionId, 'Hash')} className="hover:text-indigo-600 transition-colors"><FaCopy /></button>
                       </p>
                       <p className="text-[9px] font-mono bg-gray-50 p-3 rounded-xl border break-all leading-tight text-gray-500">
                          {order.transactionId}
                       </p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;