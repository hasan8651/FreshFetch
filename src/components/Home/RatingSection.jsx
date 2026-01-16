"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const IconStar = ({ filled }) => (
  <svg stroke="currentColor" fill={filled ? "#FBBF24" : "none"} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconQuote = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
    <path d="M14.017 21L14.017 18C14.017 16.899 14.892 16 16.017 16H19.017C19.567 16 20.017 15.55 20.017 15V9C20.017 8.45 19.567 8 19.017 8H16.017C14.912 8 14.017 7.105 14.017 6V3H21.017C22.117 3 23.017 3.895 23.017 5V15C23.017 18.315 20.332 21 17.017 21H14.017ZM1.017 21V18C1.017 16.899 1.892 16 3.017 16H6.017C6.567 16 7.017 15.55 7.017 15V9C7.017 8.45 6.567 8 6.017 8H3.017C1.912 8 1.017 7.105 1.017 6V3H8.017C9.117 3 10.017 3.895 10.017 5V15C10.017 18.315 7.332 21 4.017 21H1.017Z" />
  </svg>
);

const RatingSection = () => {
  const baseReviews = [
    { id: 1, name: "Anika Rahman", role: "Verified Buyer", rating: 5, comment: "The organic vegetables are incredibly fresh! Picked moments ago. Delivery was super fast.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", date: "2 days ago" },
    { id: 2, name: "Tanvir Ahmed", role: "Regular Customer", rating: 4, comment: "Quality is top-notch. Loved the Fuji apples. Highly recommended for daily needs.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", date: "1 week ago" },
    { id: 3, name: "Sumi Akter", role: "Verified Buyer", rating: 5, comment: "Best organic shop in town! The packaging is eco-friendly and fruits are always juicy.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", date: "3 days ago" },
    { id: 4, name: "Rakib Hasan", role: "Tech Enthusiast", rating: 5, comment: "Pure honey and reasonable pricing. I am extremely satisfied with their service.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", date: "5 days ago" },
    { id: 5, name: "Maria Sultana", role: "Home Maker", rating: 5, comment: "Guaranteed freshness! Finally found a reliable organic shop for my family.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", date: "1 day ago" },
    { id: 6, name: "Jashim Uddin", role: "Fitness Trainer", rating: 4, comment: "Great products for a healthy lifestyle. Impressed with the quality control.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", date: "4 days ago" }
  ];

  const reviews = [...baseReviews, ...baseReviews, ...baseReviews];
  
  const [currentIndex, setCurrentIndex] = useState(baseReviews.length);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (currentIndex >= baseReviews.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseReviews.length);
      }, 500);
    }
  }, [currentIndex, baseReviews.length]);

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-green-600 font-black uppercase tracking-widest text-xs"
          >
            TESTIMONIALS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-gray-900 mt-2 tracking-tight"
          >
            Real Stories From Our <br className="hidden md:block"/> <span className="text-indigo-600 italic">Healthy Family</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex text-amber-400">
               {[...Array(5)].map((_, i) => <IconStar key={i} filled={true} />)}
            </div>
            <span className="font-black text-gray-500 text-sm">4.9/5 Average Rating</span>
          </div>
        </div>

        <div 
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden py-4">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
              transition={isTransitioning ? { duration: 0.6, ease: [0.32, 0.72, 0, 1] } : { duration: 0 }}
            >
              {reviews.map((review, idx) => (
                <div 
                  key={`${review.id}-${idx}`} 
                  className="px-3 shrink-0"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="relative p-8 h-full rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between min-h-[300px]">
                    <div className="absolute top-8 right-8 text-indigo-100">
                      <IconQuote />
                    </div>

                    <div>
                      <div className="flex gap-0.5 mb-5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <IconStar key={i} filled={i < review.rating} />
                        ))}
                      </div>

                      <p className="text-gray-600 text-base leading-relaxed mb-6 font-medium italic">
                        "{review.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner bg-gray-100">
                        <Image 
                          src={review.image} 
                          alt={review.name} 
                          fill unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-base leading-none mb-1">
                          {review.name}
                        </h4>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-wider">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

         <div className="flex justify-center gap-2 mt-12">
          {baseReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(i + baseReviews.length);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                (currentIndex % baseReviews.length) === i 
                ? "bg-indigo-600 w-10" 
                : "bg-gray-200 w-2 hover:bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default RatingSection;