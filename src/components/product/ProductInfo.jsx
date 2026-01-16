"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaBox, FaShieldAlt, FaTruckLoading, FaTags, FaShoppingCart } from 'react-icons/fa';

const InfoCard = ({ icon, label, value }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 transition-shadow hover:shadow-md"
    >
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            {icon} {label}
        </div>
        <div className="text-gray-900 font-black text-sm">{value}</div>
    </motion.div>
);

const ProductInfo = ({ product }) => {
    if (!product) return null;

    return (
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
            

            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div className="space-y-2">
                    <span className="inline-block text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.2 rounded-full uppercase tracking-[0.2em] border border-green-100">
                        {product.brand}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                        {product.name}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium">
                        SKU: <span className="font-mono text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{product.sku}</span>
                    </p>
                </div>
                
                <div className="bg-gray-900 text-white p-4 rounded-3xl min-w-[120px] text-center shadow-lg shadow-gray-200">
                    <p className="text-2xl font-black">${product.price}</p>
                    {product.oldPrice && (
                        <p className="text-xs text-gray-400 line-through font-bold decoration-rose-500">
                            ${product.oldPrice}
                        </p>
                    )}
                </div>
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
                <InfoCard icon={<FaBox className="text-blue-500" />} label="Stock" value={product.stock} />
                <InfoCard icon={<FaShieldAlt className="text-yellow-500" />} label="Rating" value={`${product.rating} / 5.0`} />
                <InfoCard icon={<FaTruckLoading className="text-orange-500" />} label="Status" value={product.stockStatus} />
                <InfoCard icon={<FaTags className="text-purple-500" />} label="Category" value={product.category} />
            </div>

            <div className="mb-8">
                <h4 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-widest">About this product:</h4>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                    {product.description || "Experience the finest quality organic products sourced directly from our certified farms. This product ensures peak freshness and nutrition for your healthy lifestyle."}
                </p>
            </div>


            <div className="space-y-4 mb-10">
                <div className="flex flex-wrap gap-2">
                    {product.features?.map((f, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-xl text-xs font-black">
                            # {f}
                        </span>
                    ))}
                </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-colors shadow-xl shadow-green-100"
                >
                    <FaShoppingCart /> Add to Cart
                </motion.button>
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-white border-2 border-gray-900 text-gray-900 py-4 rounded-2xl font-black hover:bg-gray-900 hover:text-white transition-all"
                >
                    Buy It Now
                </motion.button>
            </div>

        </div>
    );
};

export default ProductInfo;