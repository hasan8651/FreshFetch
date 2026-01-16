"use client";

import React, { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit, FaChartLine, FaBoxOpen } from "react-icons/fa";
import Link from "next/link";
import axiosInstance from "../../../utils/axiosInstance";
import { AuthContext } from "../../../Provider/AuthContext";

import ImageGallery from "../../../components/Admin-Manger/ImageGallery";
import ProductInfo from "../../../components/Admin-Manger/ProductInfo";
import PriceStockChart from "../../../components/Admin-Manger/PriceStockChart";

const AdminProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRestrictedAdmin = user?.email === "admin@FreshFetch.com";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Master Data...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaBoxOpen size={50} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-black text-gray-400 uppercase">Product Not Found</h2>
        <button onClick={() => router.back()} className="mt-4 text-indigo-600 font-bold flex items-center gap-2">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-gray-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100">
                <FaArrowLeft />
            </div>
            Back to Inventory
          </button>

          <div className="flex gap-4 w-full md:w-auto">
            {isRestrictedAdmin ? (
              <button
                disabled
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-400 px-8 py-4 rounded-2xl cursor-not-allowed font-black text-[10px] uppercase tracking-widest border border-gray-200"
              >
                <FaEdit /> Restricted Access
              </button>
            ) : (
              <Link
                href={`/dashboard/admin/update-product/${product._id}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1"
              >
                <FaEdit /> Edit Properties
              </Link>
            )}
          </div>
        </div>

   
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
   
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-gray-50">
                <ImageGallery mainImg={product.singleImg} allImgs={product.images} />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
              <h3 className="flex items-center gap-3 font-black text-[11px] text-gray-400 uppercase tracking-[0.2em] mb-6">
                <FaChartLine className="text-indigo-500" /> Market Analysis
              </h3>
              <div className="h-64">
                <PriceStockChart
                    price={product.price}
                    stock={product.stock}
                    variants={product.variants}
                />
              </div>
            </div>
          </div>

  
          <div className="lg:col-span-8 space-y-8">

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden">
                <ProductInfo product={product} />
            </div>

 
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
              <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-6">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  Technical Specifications
                </h3>
                <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                    Detailed View
                </span>
              </div>
              <div className="prose prose-indigo max-w-none">
                 <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                   {product.description}
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {label: "Category", val: product.category},
                    {label: "Added By", val: product.addedBy?.name || "Admin"},
                    {label: "Rating", val: `${product.rating} / 5`},
                    {label: "Created", val: new Date(product.createdAt).toLocaleDateString()}
                ].map((item, i) => (
                    <div key={i} className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100/50">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-xs font-black text-gray-800 uppercase">{item.val}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;