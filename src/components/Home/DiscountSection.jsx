"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Snowflake, ArrowRight, Timer, Flame } from "lucide-react";

const DiscountSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date("2026-02-28T23:59:59").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const discountProducts = [
    { id: 1, name: "Organic Honey & Nuts", price: 25.0, discountPrice: 18.0, image: "https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Hot Chocolate Mix", price: 15.0, discountPrice: 10.5, image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Winter Citrus Box", price: 35.0, discountPrice: 28.0, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <section className="py-20 bg-[#F0F8FF] relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ["-10%", "110%"], rotate: 360 }}
            transition={{ duration: 15 + i, repeat: Infinity, ease: "linear" }}
            className="absolute text-blue-300"
            style={{ left: `${i * 12}%`, top: `-5%` }}
          >
            <Snowflake size={20 + i * 5} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[3rem] md:rounded-[4rem] bg-white shadow-2xl overflow-hidden border border-blue-50">
          
           <div className="relative p-10 md:p-16 bg-[#0B2F4F] text-white flex flex-col justify-center min-h-[550px]">
            <Image 
              src="https://images.unsplash.com/photo-1516550125529-21c0d0716095" unoptimized 
              alt="Winter Sale" fill className="object-cover opacity-30 mix-blend-overlay"
            />
            
            <div className="relative z-10">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit mb-6 shadow-lg">
                <Timer size={14} /> Flash Sale
              </span>

              <h2 className="text-5xl md:text-7xl font-black leading-tight mb-4">
                WINTER <br /> <span className="text-blue-300">MEGA SALE</span>
              </h2>

 
              <div className="flex gap-3 md:gap-5 my-10">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-2">
                      <span className="text-2xl md:text-3xl font-black text-yellow-400">
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-200">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl"
              >
                Grab the Deals <ArrowRight size={20} />
              </motion.button>
            </div>
          </div>

     
          <div className="p-10 md:p-16 bg-white">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-10 flex items-center gap-3">
              Hot Deals For You <Flame className="text-red-500 animate-pulse" />
            </h3>

            <div className="space-y-6">
              {discountProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-6 p-4 rounded-3xl border border-gray-100 hover:bg-blue-50/50 transition-all group">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-50">
                    <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-xl text-blue-900">${product.discountPrice}</span>
                      <span className="text-sm text-gray-400 line-through">${product.price}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;