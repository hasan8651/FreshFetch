"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

const IconFacebook = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const IconCall = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.62A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const IconMail = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 border-t border-gray-100">
      <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                      <div className="space-y-6">
           <Link href="/" className="inline-block">
                      <Image
                src="/logo.png"
                alt="FreshFetch Logo"
                width={180}
                height={50}
                className="object-contain"
                priority 
              />
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm">
              We provide the best organic and farm-fresh food products directly
              to your doorstep. Healthy living starts with healthy eating.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all group-hover:bg-indigo-600 group-hover:text-white">
                  <IconCall />
                </div>
                <span className="font-semibold text-sm">+880 1718047653</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center transition-all group-hover:bg-green-600 group-hover:text-white">
                  <IconMail />
                </div>
                <span className="font-semibold text-sm">hasan865@gmail.com</span>
              </div>
            </div>
          </div>

               <div>
            <h4 className="text-lg font-black text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Shop Grid", href: "/all-groceries" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "Our Blog", href: "/blog" },
                { name: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-green-600 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-green-500 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-gray-900 mb-6">Categories</h4>
            <ul className="space-y-4">
              {[
                "Vegetables",
                "Fresh Fruits",
                "Dairy & Eggs",
                "Beverages",
                "Meats & Seafood",
                "Organic Honey",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/all-groceries?category=${cat}`}
                    className="text-gray-500 hover:text-indigo-600 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-indigo-500 transition-all"></span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
     <Link href="/" className="inline-block">
                      <Image
                src="/logo.png"
                alt="FreshFetch Logo"
                width={150}
                height={50}
                className="object-contain"
                priority 
              />
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm">Subscribe to get latest updates, offers and coupons.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white border border-gray-200 rounded-full px-6 pr-32 py-4 text-sm outline-none focus:border-green-500 transition-all shadow-sm"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-green-600 text-white px-6 rounded-full text-xs font-bold hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100">
                Subscribe
              </button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <motion.a href="https://www.facebook.com/hasan865" whileHover={{ y: -4 }} target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm transition-all">
                <IconFacebook />
              </motion.a>
              <motion.a href="https://www.linkedin.com/in/hasan865/" whileHover={{ y: -4 }} target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm transition-all">
                <IoLogoLinkedin />
              </motion.a>
              <motion.a href="https://github.com/hasan8651" whileHover={{ y: -4 }} target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm transition-all">
                <FaGithub />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} <span className="text-indigo-800 font-bold">FreshFetch</span>. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3">
            {["Visa", "MasterCard", "PayPal", "Stripe"].map((method) => (
              <div key={method} className="bg-white border border-gray-100 px-3 py-1 rounded-md text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;