"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ImageGallery = ({ mainImg, allImgs = [] }) => {
  const [selectedImg, setSelectedImg] = useState(mainImg);

  return (
    <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-xl shadow-gray-50 border border-gray-100 h-fit">
      
      <div className="relative w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 mb-6 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImg}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={selectedImg}
              alt="Active Product View"
              fill
              priority
              className="object-cover group-hover:scale-110 transition-transform duration-700 cursor-zoom-in"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-xl">
               Roll over to zoom
            </span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {allImgs?.length > 0 ? (
          allImgs.map((img, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImg(img)}
              className={`relative h-16 md:h-20 w-full rounded-2xl overflow-hidden border-2 transition-all 
                ${selectedImg === img ? "border-indigo-500 ring-4 ring-indigo-50/50" : "border-transparent hover:border-gray-200"}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </motion.button>
          ))
        ) : (
          <div className="col-span-4 h-20 bg-gray-100 rounded-2xl animate-pulse" />
        )}
      </div>

      <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest">
        Click to preview detailed shots
      </p>
    </div>
  );
};

export default ImageGallery;