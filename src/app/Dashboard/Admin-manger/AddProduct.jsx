import React, { useContext, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaSave,
  FaRedo,
  FaListUl,
  FaTags,
  FaBoxOpen,
  FaLink,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { AuthContext } from "../../../Provider/AuthContext";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imgTab, setImgTab] = useState("upload");
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const isRestrictedAdmin = user?.email === "admin@FreshFetch.com";

  const categories = [
    "Vegetables",
    "Fresh Fruits",
    "Desserts",
    "Drinks & Juice",
    "Fish & Meats",
    "Pets & Animals",
  ];

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      currency: "USD",
      stockStatus: "in-stock",
      discountType: "percentage",
      rating: 5,
      totalReviews: 0,
      features: [""],
      tags: [""],
      variants: [{ unit: "", price: 0, stock: 0 }],
      images: [""],
      isNew: true,
      isFeatured: false,
      isActive: true,
    },
  });

  const { fields: featFields, append: addFeat, remove: remFeat } = useFieldArray({ control, name: "features" });
  const { fields: tagFields, append: addTag, remove: remTag } = useFieldArray({ control, name: "tags" });
  const { fields: varFields, append: addVar, remove: remVar } = useFieldArray({ control, name: "variants" });
  const { fields: imgFields, append: addImg, remove: remImg } = useFieldArray({ control, name: "images" });

  const watchedMain = watch("singleImg");
  const watchedThumb = watch("thumbnail");
  const watchedName = watch("name");

  useEffect(() => {
    if (watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [watchedName, setValue]);


  const uploadImg = async (file, fieldName) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const toastId = toast.loading("Uploading image...");
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );
      setValue(fieldName, res.data.data.display_url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed!", { id: toastId });
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    

    const formattedData = {
      ...data,
      price: Number(data.price),
      oldPrice: Number(data.oldPrice),
      stock: Number(data.stock),
      discountPercentage: Number(data.discountPercentage),
      rating: Number(data.rating),
      totalReviews: Number(data.totalReviews),
      variants: data.variants.map(v => ({
        ...v,
        price: Number(v.price),
        stock: Number(v.stock)
      })),
      addedBy: { name: user?.displayName, email: user?.email },
      createdAt: new Date().toISOString()
    };

    try {
      const res = await axiosInstance.post("/products", formattedData);
      if (res.status === 201 || res.status === 200) {
        toast.success("Product successfully added to shop! 🛒");
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-4 md:p-8 bg-gray-50 min-h-screen ${isRestrictedAdmin ? "opacity-70" : ""}`}
    >
      <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Publish New Item</h2>
              <p className="text-gray-400 mt-2 font-medium">Vendor: {user?.displayName || "Admin"}</p>
            </div>
            <FaBoxOpen className="text-5xl text-gray-600 hidden md:block" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-12 space-y-12">
          

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FaListUl className="text-green-600" /> Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Product Title *</label>
                <input
                  {...register("name", { required: "Title is required" })}
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all ${errors.name ? 'border-red-400' : 'border-gray-100 focus:border-green-500'}`}
                  placeholder="Organic Broccoli"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">URL Slug (Auto)</label>
                <input
                  {...register("slug", { required: true })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 outline-none"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-black uppercase text-gray-500">Category *</label>
                <select {...register("category", { required: true })} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 bg-white outline-none focus:border-green-500">
                  <option value="">Choose...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-gray-500">Brand</label>
                <input {...register("brand")} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none" placeholder="Fresh Brand" />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-gray-500">SKU</label>
                <input {...register("sku")} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none" placeholder="SKU-001" />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-gray-500">Sub Category</label>
                <input {...register("subCategory")} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none" placeholder="Green Leafy" />
              </div>
            </div>
          </section>

  
          <section className="p-8 bg-green-50 rounded-[2.5rem] border-2 border-green-100">
            <h3 className="text-sm font-black text-green-700 uppercase tracking-widest mb-6">Inventory & Pricing</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { label: "Price", name: "price" },
                { label: "Old Price", name: "oldPrice" },
                { label: "Discount %", name: "discountPercentage" },
                { label: "Stock Qty", name: "stock" },
                { label: "Rating", name: "rating" },
                { label: "Reviews", name: "totalReviews" },
              ].map((item) => (
                <div key={item.name}>
                  <label className="text-[10px] font-black uppercase text-green-600">{item.label}</label>
                  <input
                    type="number" step="0.01"
                    {...register(item.name)}
                    className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>
              ))}
            </div>
          </section>


          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FaCloudUploadAlt className="text-blue-500" /> Media Assets</h3>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {['upload', 'url'].map(tab => (
                  <button key={tab} type="button" onClick={() => setImgTab(tab)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize ${imgTab === tab ? "bg-white shadow-sm" : "text-gray-400"}`}>
                    {tab} Mode
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-500">Main Product Image</label>
                <div className="relative h-64 rounded-3xl border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {watchedMain ? <img src={watchedMain} className="w-full h-full object-cover" alt="Preview" /> : <FaCloudUploadAlt className="text-4xl text-gray-200" />}
                  {imgTab === "upload" && (
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => uploadImg(e.target.files[0], "singleImg")} />
                  )}
                </div>
                {imgTab === "url" && <input {...register("singleImg")} className="w-full p-4 border rounded-xl" placeholder="Paste URL here..." />}
              </div>

       
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-gray-500">Thumbnail Preview</label>
                <div className="relative h-64 rounded-3xl border-4 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {watchedThumb ? <img src={watchedThumb} className="w-full h-full object-cover" alt="Preview" /> : <FaCloudUploadAlt className="text-4xl text-gray-200" />}
                  {imgTab === "upload" && (
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => uploadImg(e.target.files[0], "thumbnail")} />
                  )}
                </div>
                {imgTab === "url" && <input {...register("thumbnail")} className="w-full p-4 border rounded-xl" placeholder="Paste URL here..." />}
              </div>
            </div>
          </section>

  
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2"><FaPlus className="text-purple-600" /> Multi-Variants</h3>
            <div className="space-y-4">
              {varFields.map((f, i) => (
                <div key={f.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <input {...register(`variants.${i}.unit`)} className="p-3 border rounded-xl" placeholder="Unit (e.g. 1kg)" />
                  <input type="number" {...register(`variants.${i}.price`)} className="p-3 border rounded-xl" placeholder="Price" />
                  <input type="number" {...register(`variants.${i}.stock`)} className="p-3 border rounded-xl" placeholder="Stock" />
                  <button type="button" onClick={() => remVar(i)} className="bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><FaTrash /></button>
                </div>
              ))}
              <button type="button" onClick={() => addVar({ unit: "", price: 0, stock: 0 })} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all">+ Add Weight/Size Variant</button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="font-bold flex items-center gap-2"><FaListUl className="text-orange-500" /> Features</label>
              {featFields.map((f, i) => (
                <div key={f.id} className="flex gap-2">
                  <input {...register(`features.${i}`)} className="flex-1 p-3 border rounded-xl" placeholder="e.g. 100% Organic" />
                  <button type="button" onClick={() => remFeat(i)} className="text-red-400 hover:text-red-600"><FaTrash /></button>
                </div>
              ))}
              <button type="button" onClick={() => addFeat("")} className="text-sm font-bold text-orange-600">+ Add Feature</button>
            </div>

            <div className="space-y-4">
              <label className="font-bold flex items-center gap-2"><FaTags className="text-teal-500" /> Search Tags</label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl border-2 border-dashed">
                {tagFields.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border shadow-sm">
                    <input {...register(`tags.${i}`)} className="text-xs font-bold w-16 outline-none bg-transparent" placeholder="Tag" />
                    <button type="button" onClick={() => remTag(i)} className="text-red-300 hover:text-red-500"><FaTrash size={10} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addTag("")} className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">+</button>
              </div>
            </div>
          </div>

   
          <div className="space-y-4">
             <label className="text-xs font-black uppercase text-gray-500">Full Description</label>
             <textarea {...register("description")} className="w-full p-6 border-2 border-gray-100 rounded-3xl h-48 outline-none focus:border-green-500 resize-none" placeholder="Explain the product story..." />
          </div>

     
          <footer className="flex flex-col sm:flex-row justify-end gap-6 pt-10 border-t">
            <button
              type="button"
              onClick={() => reset()}
              className="px-8 py-4 rounded-xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
            >
              <FaRedo /> Reset
            </button>
            
            <button
              type="submit"
              disabled={loading || isRestrictedAdmin}
              className={`px-12 py-4 rounded-xl bg-green-600 text-white font-black shadow-lg flex items-center gap-2 transition-all active:scale-95 ${loading || isRestrictedAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
            >
              {loading ? "Processing..." : <><FaSave /> Publish Product</>}
            </button>
          </footer>

        </form>
      </div>
    </motion.div>
  );
};

export default AddProduct;