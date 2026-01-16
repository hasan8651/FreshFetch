"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDownOutline, IoHelpCircleOutline } from "react-icons/io5";

const FAQSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const faqs = [
    {
      question: "How do I place an order on FreshFetch?",
      answer: "Ordering at FreshFetch is simple! Browse our categories, add your desired organic products to the cart, and proceed to checkout. Once confirmed, you'll receive real-time updates via SMS and email."
    },
    {
      question: "What is your return and refund policy?",
      answer: "If you receive a damaged product, report it within 24 hours. We offer a full refund or immediate replacement to ensure 100% customer satisfaction."
    },
    {
      question: "Are your products truly 100% organic?",
      answer: "Yes! We source directly from certified organic farms that follow natural cultivation methods without any harmful pesticides or synthetic fertilizers."
    },
    {
      question: "How long does delivery usually take?",
      answer: "We offer same-day delivery for orders placed before 12:00 PM. Standard delivery usually takes between 12 to 24 hours depending on your location."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Credit/Debit Cards (Visa, MasterCard), Mobile Banking (bKash, Nagad), and Cash on Delivery (COD) through our secure encrypted gateway."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIdx(activeIdx === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50/50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-green-600 font-bold uppercase tracking-[0.2em] text-xs mb-4"
          >
            <IoHelpCircleOutline size={22} className="animate-pulse" />
            <span>Support Center</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Common <span className="text-green-600 underline decoration-indigo-200 underline-offset-8">Queries</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Everything you need to know about our organic products and delivery policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group border rounded-3xl overflow-hidden transition-all duration-500 ${
                activeIdx === index 
                ? "border-green-500 bg-white shadow-2xl shadow-green-100" 
                : "border-gray-200 bg-white hover:border-green-200 shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                aria-expanded={activeIdx === index}
              >
                <span className={`text-base md:text-lg font-black transition-colors duration-300 ${
                  activeIdx === index ? "text-green-600" : "text-gray-800"
                }`}>
                  {faq.question}
                </span>
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  activeIdx === index ? "bg-green-600 text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-green-50"
                }`}>
                  <IoChevronDownOutline size={18} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {activeIdx === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-6 md:px-8 pb-8 text-gray-600 leading-relaxed text-sm md:text-base border-t border-gray-50 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-16 bg-gradient-to-br from-indigo-900 to-indigo-800 p-8 md:p-12 rounded-[2.5rem] text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200"
        >
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black mb-3">Still have questions?</h3>
            <p className="text-indigo-100 mb-8 max-w-md mx-auto text-sm opacity-80">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our 24/7 dedicated support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-500 hover:bg-white hover:text-green-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95">
                Live Chat
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black transition-all backdrop-blur-md">
                Email Support
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FAQSection;