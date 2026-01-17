"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import ProductCard from "../ProductCard";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchProducts = async (category = "") => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/products", {
        params: {
          limit: 8,
          category: category || undefined,
        },
      });
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filter);
  }, [filter]);

  const categories = [
    { label: "All Products", value: "" },
    { label: "Vegetables", value: "Vegetables" },
    { label: "Fresh Fruits", value: "Fruits" },
    { label: "Desserts", value: "Dairy" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div className="text-center lg:text-left">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-green-600 font-black tracking-[0.2em] text-xs uppercase block mb-2"
            >
              Our Collection
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              Featured Products
            </h2>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                  filter === cat.value
                    ? "bg-green-600 text-white shadow-lg shadow-green-100"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[350px] bg-gray-100 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold italic">No products found in this category.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/all-groceries">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-700 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-800 transition-all shadow-2xl shadow-indigo-100"
            >
              Explore Full Catalog
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;