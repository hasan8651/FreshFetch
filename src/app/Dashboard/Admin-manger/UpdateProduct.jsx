"use client";

import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import {
  FaPlus, FaTrash, FaCloudUploadAlt, FaSave, FaArrowLeft,
  FaBoxOpen, FaTags, FaListUl, FaImages, FaUserShield, FaExclamationTriangle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { AuthContext } from "../../../Provider/AuthContext";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imgTab, setImgTab] = useState("upload");
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const isRestrictedAdmin = user?.email === "admin@FreshFetch.com";

  const categories = [
    "Vegetables", "Fresh Fruits", "Desserts", "Drinks & Juice", "Fish & Meats", "Pets & Animals",
  ];

  const { register, handleSubmit, control, reset, setValue, watch } = useForm();


  const { fields: featFields, append: addFeat, remove: remFeat } = useFieldArray({ control, name: "features" });
  const { fields: tagFields, append: addTag, remove: remTag } = useFieldArray({ control, name: "tags" });
  const { fields: varFields, append: addVar, remove: remVar } = useFieldArray({ control, name: "variants" });
  const { fields: imgFields, append: addImg, remove: remImg } = useFieldArray({ control, name: "images" });

  const watchedMain = watch("singleImg");
  const watchedThumb = watch("thumbnail");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        const data = res.data;
  
        if (!data.features) data.features = [];
        if (!data.tags) data.tags = [];
        if (!data.variants) data.variants = [];
        if (!data.images) data.images = [];
        
        reset(data);
      } catch (error) {
        toast.error("Failed to load product");
        navigate("/dashboard/admin/manage-products");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, reset, navigate]);

  const uploadImg = async (file, fieldName) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    Swal.fire({
      title: "Uploading...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
      setValue(fieldName, res.data.data.display_url);
      Swal.close();
      toast.success("Image uploaded!");
    } catch (err) {
      Swal.fire("Error", "Upload failed", "error");
    }
  };

  const onSubmit = async (data) => {
    if (isRestrictedAdmin) {
      return Swal.fire("Restricted", "Demo Admin cannot save changes.", "warning");
    }

    setLoading(true);
    const { _id, createdAt, ...updateData } = data;


    const numericData = {
      ...updateData,
      price: Number(data.price),
      oldPrice: Number(data.oldPrice),
      stock: Number(data.stock),
      discountPercentage: Number(data.discountPercentage),
      rating: Number(data.rating),
      totalReviews: Number(data.totalReviews),
      updatedAt: new Date(),
    };

    try {
      await axiosInstance.patch(`/products/${id}`, numericData);
      Swal.fire({ icon: "success", title: "Success", text: "Product Updated!", timer: 2000, showConfirmButton: false });
      navigate("/dashboard/admin/manage-products");
    } catch (error) {
      Swal.fire("Error", "Failed to update product", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading Data...</p>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 bg-gray-50 min-h-screen relative">
      

      {isRestrictedAdmin && (
        <div className="sticky top-4 z-50 mb-6 max-w-6xl mx-auto">
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-xl shadow-md flex items-center gap-4">
            <FaExclamationTriangle className="text-amber-600 shrink-0" />
            <p className="text-amber-800 text-sm font-bold uppercase">
              Notice: You are in "Demo Mode". Changes cannot be saved to the database.
            </p>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden ${isRestrictedAdmin ? "opacity-75" : ""}`}>

        <div className="bg-gray-900 p-10 text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Edit Product</h2>
            <span className="inline-block mt-3 px-4 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">UID: {id}</span>
          </div>
          <button onClick={() => navigate(-1)} className="relative z-10 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all">
            <FaArrowLeft />
          </button>
  
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-20 -mt-20 blur-3xl" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-14 space-y-16">
    
          <section className="bg-indigo-50/50 p-10 rounded-[2.5rem] border border-indigo-100">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { label: "Base Price", name: "price", icon: "$" },
                  { label: "Old Price", name: "oldPrice", icon: "$" },
                  { label: "Discount %", name: "discountPercentage", icon: "%" },
                  { label: "Stock Qty", name: "stock", icon: "Qty" },
                  { label: "User Rating", name: "rating", icon: "★" },
                  { label: "Total Reviews", name: "totalReviews", icon: "#" }
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-indigo-400 ml-1">{item.label}</label>
                    <div className="relative">
                      <input 
                        type="number" step="0.01" 
                        {...register(item.name)}
                        disabled={isRestrictedAdmin}
                        className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-700 bg-white" 
                      />
                    </div>
                  </div>
                ))}
             </div>
          </section>


          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg"><FaBoxOpen /></div>
               <h3 className="text-2xl font-black uppercase tracking-tighter">Inventory Variants</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               <AnimatePresence>
                {varFields.map((f, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    key={f.id} 
                    className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-[2rem] border-2 border-gray-50 shadow-sm hover:border-indigo-200 transition-all items-end"
                  >
                    <div className="flex-1 w-full space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Unit/Size</label>
                      <input {...register(`variants.${i}.unit`)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:bg-white border-transparent focus:border-indigo-100 border-2 transition-all" placeholder="e.g. 1kg" />
                    </div>
                    <div className="w-full md:w-32 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Price</label>
                      <input type="number" step="0.01" {...register(`variants.${i}.price`)} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
                    </div>
                    <button type="button" onClick={() => remVar(i)} className="p-5 text-red-400 hover:text-red-600 transition-colors cursor-pointer"><FaTrash /></button>
                  </motion.div>
                ))}
               </AnimatePresence>
            </div>
            
            <button 
              type="button" 
              onClick={() => addVar({ unit: "", price: 0, stock: 0 })}
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <FaPlus /> Add New Variant
            </button>
          </section>

 
          <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-10 border-t border-gray-100">
              <button 
                type="button" onClick={() => navigate(-1)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors"
              >
                Cancel and Return
              </button>
              <button
                type="submit"
                disabled={loading || isRestrictedAdmin}
                className="w-full sm:w-auto px-16 py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaSave />}
                {loading ? "Processing..." : "Commit Changes"}
              </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProduct;