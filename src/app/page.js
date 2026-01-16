"use client";

import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import DiscountSection from '../components/home/DiscountSection';
import RatingSection from '../components/home/RatingSection';
import ServiceSection from '../components/home/ServiceSection';
import FAQSection from '../components/home/FAQSection';

const HomePage = () => {
  const fadeInVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariant}
        className="py-12 md:py-20"
      >
        <ServiceSection />
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInVariant}
        className="py-12 md:py-24 bg-gray-50/50"
      >
        <FeaturedProducts />
      </motion.section>
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariant}
      >
        <DiscountSection />
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariant}
        className="py-16 md:py-24"
      >
        <RatingSection />
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariant}
        className="py-16 md:py-24 bg-gray-50/30"
      >
        <FAQSection />
      </motion.section>
    </main>
  );
};

export default HomePage;