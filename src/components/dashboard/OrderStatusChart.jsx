"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const OrderStatusChart = ({ orders = [] }) => {
  const statusCounts = orders.reduce((acc, o) => {
    const status = o.orderStatus || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map(key => ({
    status: key.toUpperCase(),
    count: statusCounts[key]
  }));

  const COLORS = {
    DELIVERED: "#16a34a", // Green
    PENDING: "#eab308",   // Yellow
    SHIPPED: "#2563eb",   // Blue
    CANCELLED: "#dc2626", // Red
    PROCESSING: "#8b5cf6" // Purple
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px] flex items-center justify-center italic text-gray-400">
        No order status available
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
      <h3 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-tight">Order Fulfillment Status</h3>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="status" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#6b7280', fontSize: 11, fontWeight: 'bold'}} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9ca3af', fontSize: 12}} 
            />
            <Tooltip 
              cursor={{fill: '#f9fafb'}} 
              contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
            />
            <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={45}>
               {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status] || "#2563eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderStatusChart;