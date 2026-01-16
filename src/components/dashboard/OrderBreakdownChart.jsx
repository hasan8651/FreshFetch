"use client";

import React from "react";
import { motion } from "framer-motion";

const OrderBreakdownChart = ({ orders = [] }) => {
  const delivered = orders.filter(o => o.orderStatus === "delivered").length;
  const pending = orders.filter(o => o.orderStatus === "pending").length;
  const cancelled = orders.filter(o => o.orderStatus === "cancelled").length;
  const total = orders.length;

  const stats = [
    { name: "Delivered", value: delivered, color: "bg-emerald-500", glow: "shadow-emerald-200" },
    { name: "Pending", value: pending, color: "bg-indigo-500", glow: "shadow-indigo-200" },
    { name: "Cancelled", value: cancelled, color: "bg-rose-500", glow: "shadow-rose-200" },
  ];

  return (
    <div className="relative h-[420px] w-full rounded-[2.5rem] md:rounded-[3rem] bg-white border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.04)] p-8 md:p-10 flex flex-col justify-between overflow-hidden group">
      
      <div className="relative z-10">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">
          Order Breakdown
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
          Efficiency Metrics
        </p>
      </div>

      <div className="flex justify-around items-end flex-1 py-8">
        {stats.map((item, index) => {
          const percentage = total ? (item.value / total) * 100 : 0;
          
          return (
            <div key={item.name} className="flex flex-col items-center w-full max-w-[60px]">
              <div className="relative w-3 md:w-4 h-48 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${percentage}%` }}
                  transition={{ duration: 1.2, ease: "circOut", delay: index * 0.1 }}
                  className={`absolute bottom-0 w-full rounded-full ${item.color} ${item.glow} shadow-lg`}
                />
              </div>
              
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mt-4 text-lg font-black text-gray-900"
              >
                {item.value}
              </motion.span>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1 text-center leading-tight">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-gray-50">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
            Total Traffic
          </span>
          <span className="text-3xl font-black text-gray-900 leading-none">
            {total}
          </span>
        </div>

        <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black border border-emerald-100">
          STABLE
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-50/50 rounded-full blur-3xl -z-10" />
    </div>
  );
};

export default OrderBreakdownChart;