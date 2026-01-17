"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";

const OrderSuccessPage = () => {
  useEffect(() => {
     const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#16a34a", "#4f46e5"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#16a34a", "#4f46e5"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-gray-100"
      >
         <div className="mb-6 flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600"
          >
            <CheckCircle size={48} strokeWidth={3} />
          </motion.div>
        </div>

           <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. Your organic farm-fresh products are being prepared for delivery.
        </p>


        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">1</div>
            <div>
              <p className="text-sm font-bold text-gray-800">Order Placed</p>
              <p className="text-xs text-gray-400">We have received your order</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs">2</div>
            <div>
              <p className="text-sm font-bold text-gray-400">Processing</p>
              <p className="text-xs text-gray-400">Quality check and packaging</p>
            </div>
          </div>
        </div>


        <div className="flex flex-col gap-3">
          <Link 
            href="/all-groceries"
            className="bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
          
          <Link 
            href="/dashboard/my-orders"
            className="text-gray-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
          >
            Track Order
            <ArrowRight size={18} />
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          A confirmation email has been sent to your inbox.
        </p>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;