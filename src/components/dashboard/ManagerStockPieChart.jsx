"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const ManagerStockPieChart = ({ stats = { lowStock: 0, outOfStock: 0 }, products = [] }) => {
  const healthyStock = Array.isArray(products) 
    ? products.filter(p => p.stock >= 10).length 
    : 0;
  
  const data = [
    { name: "Healthy", value: healthyStock },
    { name: "Low Stock", value: stats.lowStock || 0 },
    { name: "Out of Stock", value: stats.outOfStock || 0 }
  ];
  
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  if (!products.length && !stats.lowStock && !stats.outOfStock) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[450px] flex items-center justify-center">
        <p className="text-gray-400 font-bold italic">No inventory data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[450px] flex flex-col">
      <h3 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-tight">Stock Health Summary</h3>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="45%" 
              innerRadius={75}
              outerRadius={100} 
              paddingAngle={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '11px', color: '#6b7280' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-around text-center">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase">Total Items</p>
          <p className="text-lg font-black text-gray-800">
            {healthyStock + (stats.lowStock || 0) + (stats.outOfStock || 0)}
          </p>
        </div>
        <div className="border-l border-gray-100 h-8 self-center"></div>
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase">Alerts</p>
          <p className="text-lg font-black text-red-500">{(stats.lowStock || 0) + (stats.outOfStock || 0)}</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerStockPieChart;