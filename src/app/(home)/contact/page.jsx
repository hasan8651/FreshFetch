"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoTimeOutline,
  IoLogoLinkedin,
} from "react-icons/io5";
import { FaFacebook, FaGithub } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactDetails = [
    {
      icon: <IoLocationOutline size={28} />,
      title: "Our Location",
      detail: "Bogura, Bangladesh",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <IoCallOutline size={28} />,
      title: "Phone Number",
      detail: "+880 1718047653",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <IoMailOutline size={28} />,
      title: "Email Address",
      detail: "hasan865@gmail.com",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: <IoTimeOutline size={28} />,
      title: "Working Hours",
      detail: "Sat - Thu: 09:00 AM - 10:00 PM",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in the required fields");
      return;
    }
     console.log("Form Data:", formData);
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-indigo-900 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-20 -mb-20 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
          >
            Connect With Us
          </motion.h1>
          <p className="text-indigo-100 max-w-2xl mx-auto font-medium">
            We are ready to provide you with the best service from the heart of
            Rajshahi. Contact us for any need.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 pb-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {contactDetails.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-start gap-4"
                >
                  <div className={`p-4 rounded-2xl ${item.color} shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mt-1 font-semibold">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

             <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 text-center">
              <h3 className="font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">
                Follow Us
              </h3>
              <div className="flex items-center justify-center gap-4 pt-4">
                <motion.a
                  href="https://www.facebook.com/hasan865"
                  whileHover={{ y: -4 }}
                  target="_blank"
                  className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                >
                  <FaFacebook size={20} />
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/hasan865/"
                  whileHover={{ y: -4 }}
                  target="_blank"
                  className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-blue-700 hover:bg-blue-50 transition-all shadow-sm"
                >
                  <IoLogoLinkedin size={22} />
                </motion.a>
                
                <motion.a
                  href="https://github.com/hasan8651"
                  whileHover={{ y: -4 }}
                  target="_blank"
                  className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                >
                  <FaGithub size={22} />
                </motion.a>
              </div>
            </div>
          </div>

   
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 h-full"
            >
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8">
                Send Us a Message
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your Name"
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="yourname@gmail.com"
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="How can we help?"
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2 uppercase tracking-wider">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Write your message here..."
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all uppercase tracking-widest"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

          <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 rounded-[40px] overflow-hidden shadow-sm border border-gray-100 h-[450px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58117.47898863116!2d88.566275815525!3d24.37330768565251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbefd0a5588c93%3A0xf90390f1c9c41008!2sRajshahi!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;