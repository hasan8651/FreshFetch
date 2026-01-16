"use client";

import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { motion } from "framer-motion";

const ProductPieChart = ({ totalProducts = 0 }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  const maxCapacity = 500; 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    {
      name: "Products",
      value: totalProducts,
      fill: "#8b5cf6", // Violet-500
    },
  ];

  if (!isMounted) return <div className="h-[420px] w-full bg-gray-50 animate-pulse rounded-[3rem]" />;

  return (
    <div className="relative h-[420px] w-full rounded-[3rem] bg-white border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.05)] p-10 flex flex-col justify-between overflow-hidden group">
      
      <div className="relative z-10">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">
          Inventory Meter
        </h3>
        <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mt-1">
          Stock Analytics
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="75%"
            outerRadius="100%"
            barSize={24}
            data={data}
            startAngle={225}
            endAngle={-45}
          >

            <PolarAngleAxis
              type="number"
              domain={[0, maxCapacity]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#f3f4f6' }}
              dataKey="value"
              cornerRadius={20}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Current Stock
          </span>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-black text-gray-900 mt-1"
          >
            {totalProducts}
          </motion.span>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-4 py-1.5 rounded-full shadow-sm">
              Live Tracker
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-gray-50 pt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base</span>
          <span className="text-sm font-black text-gray-700">0 Items</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Threshold</span>
          <span className="text-sm font-black text-gray-700">{maxCapacity} Max</span>
        </div>
      </div>

      <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-100/50 rounded-full blur-3xl -z-10 group-hover:bg-violet-200/50 transition-colors duration-1000" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
    </div>
  );
};

export default ProductPieChart;