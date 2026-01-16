"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";

const PriceStockChart = ({ price, stock, variants = [] }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = variants?.length > 0 
    ? variants.map(v => ({ name: v.unit, price: v.price, stock: v.stock }))
    : [{ name: 'Default', price: price, stock: stock }];

  if (!isMounted) return <div className="h-64 w-full bg-gray-50 animate-pulse rounded-2xl" />;

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-full">
      <div className="mb-6 flex justify-between items-center">
        <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">
          Variant Analysis
        </h4>
        <span className="text-[10px] font-bold text-gray-400">Price vs Inventory</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 600}} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9CA3AF', fontSize: 12}} 
            />
            <Tooltip 
              cursor={{fill: '#F9FAFB'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="price" 
              fill="url(#colorPrice)" 
              name="Price ($)" 
              radius={[6, 6, 0, 0]} 
              barSize={20}
            />
            <Bar 
              dataKey="stock" 
              fill="url(#colorStock)" 
              name="Stock Qty" 
              radius={[6, 6, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceStockChart;