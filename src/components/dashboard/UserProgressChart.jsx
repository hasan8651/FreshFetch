"use client";

import React from "react";
import { motion } from "framer-motion";

const UserProgressChart = ({ totalUsers = 0 }) => {
  const targetUsers = 5000;
  const progress = Math.min((totalUsers / targetUsers) * 100, 100);

  return (
    <div className="relative h-[360px] w-full rounded-[2.5rem] md:rounded-[3rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col justify-between p-8 md:p-10 overflow-hidden group">
      
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl group-hover:bg-indigo-200/50 transition-colors duration-700" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-800 tracking-tight">
            User Growth
          </h3>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <p className="text-[10px] text-indigo-400 font-black mt-1 uppercase tracking-[0.2em]">
          Active Membership
        </p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter"
          >
            {totalUsers.toLocaleString()}
          </motion.span>
          <span className="ml-3 text-sm md:text-base font-bold text-gray-400">
            / {targetUsers.toLocaleString()}
          </span>
        </div>

        <div className="w-full h-4 md:h-5 rounded-full bg-gray-100 p-1 shadow-inner">
   
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 shadow-lg shadow-indigo-200"
          />
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starting</span>
            <span className="text-xs font-bold text-gray-800">0</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Goal</span>
            <span className="text-xs font-bold text-gray-800">{targetUsers.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
           </div>
           <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Completion
          </span>
        </div>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-lg font-black text-indigo-600"
        >
          {progress.toFixed(1)}%
        </motion.span>
      </div>

    </div>
  );
};

export default UserProgressChart;