"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";


const HeroSection = () => {
  const router = useRouter();
  const [categoryCounts, setCategoryCounts] = useState({});

  const categories = [
    { name: "Vegetables", icon: "🧺", slug: "Vegetables" },
    { name: "Fresh Fruits", icon: "🍎", slug: "Fruits" },
    { name: "Desserts", icon: "🧁", slug: "Dairy" },
    { name: "Drinks & Juice", icon: "🧃", slug: "Beverages" },
    { name: "Fish & Meats", icon: "🐟", slug: "Meats" },
    { name: "Pets & Animals", icon: "🐶", slug: "Pets" },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get("/products?limit=100");
        const allProducts = response.data.products;
        const counts = allProducts.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});
        setCategoryCounts(counts);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    router.push(`/all-grocerice?category=${categorySlug}`);
  };

  return (
    <section className="bg-white py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto lg:overflow-visible items-center justify-between gap-6 pb-10 no-scrollbar">
          {categories.map((cat, idx) => {
            const dynamicCount = categoryCounts[cat.slug] || 0;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex items-center gap-3 min-w-max cursor-pointer group"
              >
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-indigo-100 transition-colors">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4>
                  <p className="text-xs text-gray-400">{dynamicCount} Products</p>
                </div>
                {idx !== categories.length - 1 && (
                  <div className="hidden lg:block h-6 w-[1px] bg-gray-100 ml-4"></div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 relative rounded-[2rem] overflow-hidden group min-h-[400px]"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >

              <source src="/videos/fresh-ness-hero.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>

            <div className="relative z-10 p-8 md:p-16 h-full flex flex-col justify-center items-start text-white">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-600 px-5 py-1.5 rounded-full text-xs md:text-sm font-bold mb-6 tracking-wide shadow-lg"
              >
                100% FARM FRESH FOOD
              </motion.span>
              <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-4 drop-shadow-lg font-serif italic">
                Fresh Organic <br />
                <span className="text-amber-400 not-italic font-sans">Food For All</span>
              </h1>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl md:text-6xl font-black text-white">$59.00</span>
                <span className="text-lg line-through opacity-70">$80.00</span>
              </div>
              <button
                onClick={() => router.push("/all-grocerice")}
                className="bg-indigo-700 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-indigo-800 transition-all duration-300 shadow-xl active:scale-95"
              >
                Shop Now
              </button>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="relative rounded-[2rem] overflow-hidden h-1/2 min-h-[250px] group shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
                alt="Creamy Fruits"
                fill unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/30 transition-all"></div>
              <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">Creamy Fruits baby Jem</h3>
                <button
                  onClick={() => router.push("/all-grocerice")}
                  className="bg-white text-indigo-900 w-fit px-6 py-2 rounded-full text-xs font-black hover:bg-amber-400 hover:text-white transition-colors"
                >
                  SHOP NOW
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-6 h-1/2 min-h-[250px]">

              <motion.div whileHover={{ y: -5 }} className="relative rounded-[2rem] overflow-hidden group shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1555244162-803834f70033"
                  alt="Desert"
                  fill unoptimized
                  className="object-cover group-hover:rotate-2 transition-transform duration-500"
                />
                <div className="relative z-10 p-4 h-full flex flex-col justify-between items-center">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <h4 className="font-black text-[10px] text-indigo-900 uppercase">SWEET DESERT</h4>
                  </div>
                  <button onClick={() => router.push("/all-grocerice")} className="bg-white text-indigo-900 px-4 py-1.5 rounded-full text-[10px] font-bold">Buy Now</button>
                </div>
              </motion.div>


              <motion.div whileHover={{ y: -5 }} className="relative rounded-[2rem] overflow-hidden group shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03"
                  alt="Discount"
                  fill unoptimized
                  className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black z-20">15% OFF</div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-between items-center">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center">
                    <h4 className="font-black text-[10px] text-gray-800 uppercase">DARK WASH</h4>
                  </div>
                  <button onClick={() => router.push("/all-grocerice")} className="bg-indigo-800 text-white px-4 py-1.5 rounded-full text-[10px] font-bold">Shop All</button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;