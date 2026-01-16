"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const RevenueDonutChart = ({ totalRevenue = 0 }) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: "Completed", value: totalRevenue * 0.65, color: "#10b981" }, // Emerald-500
    { name: "Pending", value: totalRevenue * 0.2, color: "#f59e0b" },    // Amber-500
    { name: "Processing", value: totalRevenue * 0.15, color: "#6366f1" }, // Indigo-500
  ];

  if (!isMounted) return <div className="h-[420px] w-full bg-gray-50 animate-pulse rounded-[3rem]" />;

  return (
    <div className="relative h-[420px] w-full rounded-[3rem] bg-white border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center overflow-hidden group">
      
      <div className="absolute top-8 text-center z-10">
        <h3 className="text-xl font-black text-gray-800 tracking-tight">
          Revenue Overview
        </h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
          Fiscal Performance
        </p>
      </div>

      <div className="w-full h-[280px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={85}
              outerRadius={115}
              dataKey="value"
              paddingAngle={8}
              stroke="none"
              cornerRadius={12}
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((item, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={item.color} 
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase">{payload[0].name}</p>
                      <p className="text-lg font-black text-gray-900">${payload[0].value.toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

 
      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
          Total Net
        </span>
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl md:text-4xl font-black text-gray-900 leading-none mt-1"
        >
          ${totalRevenue.toLocaleString()}
        </motion.span>
        <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          12.5%
        </div>
      </div>

 
      <div className="absolute bottom-8 flex gap-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{item.name}</span>
          </div>
        ))}
      </div>


      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-50 rounded-full blur-3xl -z-10 group-hover:bg-emerald-100/50 transition-colors" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-50 rounded-full blur-3xl -z-10" />
    </div>
  );
};

export default RevenueDonutChart;