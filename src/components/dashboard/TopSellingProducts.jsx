"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TopSellingProducts = ({ orders = [] }) => {
  const productSales = {};
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px] flex items-center justify-center">
        <p className="text-gray-400 font-bold">No sales data available</p>
      </div>
    );
  }

  orders.forEach(order => {
    if (Array.isArray(order.products)) {
      order.products.forEach(p => {
        productSales[p.name] = (productSales[p.name] || 0) + (p.quantity || 0);
      });
    }
  });

  const data = Object.keys(productSales)
    .map(name => ({ name, sales: productSales[name] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
      <h3 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-tight">Most Ordered Items</h3>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ left: -20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={100} 
              tick={{fontSize: 11, fontWeight: '600', fill: '#6b7280'}} 
            />
            <Tooltip 
              cursor={{fill: '#f9fafb'}} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="sales" 
              fill="#8b5cf6" 
              radius={[0, 10, 10, 0]} 
              barSize={12} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopSellingProducts;