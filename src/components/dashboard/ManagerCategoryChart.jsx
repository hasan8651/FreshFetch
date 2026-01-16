"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const ManagerCategoryChart = ({ products = [] }) => {
  const categoryMap = Array.isArray(products) ? products.reduce((acc, p) => {
    const category = p.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {}) : {};

  const data = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#06b6d4"];

  if (data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[450px] flex items-center justify-center">
        <p className="text-gray-400 font-bold italic">No category data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[450px] flex flex-col">
      <h3 className="text-xl font-black mb-6 text-gray-800 uppercase tracking-tight">Category Distribution</h3>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="45%" 
              innerRadius={65} 
              outerRadius={90} 
              paddingAngle={5} 
              dataKey="value"
              animationBegin={200}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="none" 
                  className="hover:opacity-80 transition-opacity outline-none"
                />
              ))}
            </Pie>
            
            <Tooltip 
               contentStyle={{ 
                 borderRadius: '15px', 
                 border: 'none', 
                 boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                 padding: '10px'
               }}
               itemStyle={{ fontWeight: 'bold', fontSize: '13px' }}
            />
            
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              layout="horizontal"
              wrapperStyle={{ 
                paddingTop: '25px', 
                fontSize: '11px', 
                fontWeight: '700', 
                textTransform: 'capitalize',
                color: '#4b5563'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagerCategoryChart;