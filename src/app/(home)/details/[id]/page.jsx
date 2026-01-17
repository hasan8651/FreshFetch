"use client";

import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoStar,
  IoCartOutline,
  IoHeartOutline,
  IoSyncOutline,
  IoCheckmarkCircle,
  IoShieldCheckmarkOutline,
  IoLeafOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

const ProductDetails = ({ params }) => {
  const { id } = use(params);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/products/${id}`);
        const data = res.data;

        setProduct(data);
        setMainImage(data.singleImg || data.thumbnail);

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        const relatedRes = await axiosInstance.get(
          `/products?category=${data.category}&limit=5`
        );
        const relatedData = relatedRes.data;
        setRelatedProducts(relatedData.products.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartItem = {
      cartId: `${product._id}-${selectedVariant ? selectedVariant.unit : "default"}`,
      productId: product._id,
      name: product.name,
      image: product.singleImg || product.thumbnail,
      price: selectedVariant ? Number(selectedVariant.price) : Number(product.price),
      unit: selectedVariant ? selectedVariant.unit : "Standard",
      quantity: quantity,
      category: product.category,
    };

    const existingItemIndex = existingCart.findIndex(
      (item) => item.cartId === cartItem.cartId
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: "12px", background: "#1f2937", color: "#fff" },
    });

    window.dispatchEvent(new Event("storage"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-gray-200 border-t-green-600 rounded-full"
        />
      </div>
    );
  }

  if (!product) return <div className="text-center py-20">Product not found!</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen pb-20 font-sans"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          <div className="space-y-4">
            <motion.div className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {Number(product.discountPercentage) > 0 && (
                <span className="absolute top-6 left-6 bg-pink-500 text-white font-black px-4 py-1.5 rounded-full shadow-lg text-sm uppercase">
                  -{product.discountPercentage}%
                </span>
              )}
            </motion.div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[product.singleImg, ...(product.images || [])]
                .filter(Boolean)
                .map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      mainImage === img ? "border-green-600" : "border-gray-100"
                    }`}
                  >
                    <Image src={img} className="w-full h-full object-cover" unoptimized width={100} height={100} alt="gallery" />
                  </button>
                ))}
            </div>
          </div>

   
          <div className="flex flex-col">
            <span className="text-green-600 font-bold uppercase tracking-widest text-xs">
              {product.brand} • {product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-2 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <IoStar key={i} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-gray-400 font-bold text-sm">({product.totalReviews} Reviews)</span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-black text-indigo-900">
                ${selectedVariant ? Number(selectedVariant.price).toFixed(2) : Number(product.price).toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">${Number(product.oldPrice).toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>


            {product.variants?.length > 0 && (
              <div className="mb-10">
                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-4">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all ${
                        selectedVariant?.unit === v.unit ? "border-green-600 bg-green-50" : "border-gray-100"
                      }`}
                    >
                      {v.unit} - ${v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

   
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center bg-gray-100 rounded-2xl p-1 px-4 h-14 border border-gray-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl font-bold px-2">-</button>
                <input type="number" value={quantity} readOnly className="w-12 text-center bg-transparent font-black text-xl" />
                <button onClick={() => setQuantity(quantity + 1)} className="text-2xl font-bold px-2">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-green-700 transition-all uppercase"
              >
                <IoCartOutline size={24} /> Add to Cart
              </button>
            </div>

     
            <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <IoLeafOutline size={26} className="mx-auto text-green-600 mb-2" />
                <p className="text-[10px] font-black uppercase text-gray-400">100% Organic</p>
              </div>
              <div>
                <IoShieldCheckmarkOutline size={26} className="mx-auto text-blue-600 mb-2" />
                <p className="text-[10px] font-black uppercase text-gray-400">Quality Tested</p>
              </div>
              <div>
                <IoCheckmarkCircle size={26} className="mx-auto text-amber-600 mb-2" />
                <p className="text-[10px] font-black uppercase text-gray-400">Farm to Table</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase">
              Related <span className="text-green-600">Products</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetails;