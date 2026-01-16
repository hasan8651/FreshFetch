"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  IoCheckmarkCircle, 
  IoCarOutline, 
  IoShieldCheckmarkOutline, 
  IoTimeOutline, 
  IoWalletOutline 
} from "react-icons/io5";

const ServiceSection = () => {
  const extraServices = [
    {
      title: "Free Delivery",
      desc: "On all orders over $50.00",
      icon: <IoCarOutline className="text-4xl text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Safe Payment",
      desc: "100% secure payment methods",
      icon: <IoShieldCheckmarkOutline className="text-4xl text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "24/7 Support",
      desc: "Dedicated support anytime",
      icon: <IoTimeOutline className="text-4xl text-purple-600" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Easy Returns",
      desc: "30 days money back guarantee",
      icon: <IoWalletOutline className="text-4xl text-amber-600" />,
      bgColor: "bg-amber-50",
    },
  ];

  const features = [
    "Best Services than others",
    "100% Organic & Natural Products",
    "100% Returns & Refunds",
    "User-Friendly Mobile Apps",
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          
          <div className="flex-1 relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex justify-center"
            >
              <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[550px] bg-green-100 rounded-t-full overflow-hidden flex items-end">
                <Image 
                  src="https://img.freepik.com/free-photo/delivery-man-with-face-mask-delivering-food-order-new-normal-concept_23-2148532986.jpg" 
                  alt="Delivery Man"
                  fill unoptimized
                  className="object-cover"
                  priority
                />
              </div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 right-0 md:right-10 bg-white p-4 rounded-2xl shadow-xl z-20"
              >
                <span className="text-3xl">🍓</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                className="absolute bottom-24 left-0 md:-left-10 bg-white p-4 rounded-2xl shadow-xl z-20"
              >
                <span className="text-3xl">🍊</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="absolute bottom-10 right-0 md:-right-5 bg-white p-5 rounded-3xl shadow-2xl z-20 border border-gray-50"
              >
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Month Sale</p>
                <p className="text-2xl font-black text-gray-800">$45,890</p>
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-green-500 text-xs font-bold">↑ 2.35%</span>
                   <div className="flex gap-1 h-5 items-end">
                      <div className="w-1.5 bg-green-100 h-2 rounded-full"></div>
                      <div className="w-1.5 bg-green-300 h-3 rounded-full"></div>
                      <div className="w-1.5 bg-green-500 h-5 rounded-full"></div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
                Best Quality <br /> 
                <span className="text-green-600 italic font-serif">Healthy & Fresh</span> <br /> 
                Grocery
              </h2>
              <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                We prioritize quality in each of our items. Our farm-to-table process ensures you get 100% organic and fresh nutrients every day.
              </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
                {features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="bg-green-100 rounded-full p-1">
                      <IoCheckmarkCircle className="text-green-600 text-xl shrink-0" />
                    </div>
                    <span className="font-bold text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/all-grocerise">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                >
                  Order Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {extraServices.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -12 }}
              className={`${service.bgColor} p-10 rounded-[2.5rem] transition-all duration-300 group cursor-pointer border border-transparent hover:border-white hover:shadow-2xl hover:shadow-gray-200`}
            >
              <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                {service.icon}
              </div>
              <h4 className="text-xl font-black text-gray-800 mb-3 tracking-tight">{service.title}</h4>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServiceSection;