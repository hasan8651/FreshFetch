"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoTrashOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoArrowBackOutline,
  IoCartOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [ready, setReady] = useState(false);

  const SHIPPING_THRESHOLD = 50;
  const SHIPPING_CHARGE = 2;


  const syncCart = useCallback(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("cart"));
      const items = Array.isArray(data) ? data : [];
      setCartItems(items);
      
      const total = items.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );
      setSubtotal(total);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    syncCart();
    

    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, [syncCart]);


  const updateCartAndNotify = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    

    const total = newItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    setSubtotal(total);


    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQty = (id, value) => {
    const updated = cartItems.map((item) =>
      item.cartId === id
        ? { ...item, quantity: Math.max(1, item.quantity + value) }
        : item
    );
    updateCartAndNotify(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.cartId !== id);
    updateCartAndNotify(updated);
  };

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shipping;
  const progress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

  if (!ready) return <div className="min-h-screen flex items-center justify-center font-bold">Loading Cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <div className="w-32 h-32 bg-white rounded-full shadow flex items-center justify-center mx-auto mb-6">
            <IoCartOutline size={60} className="text-gray-300" />
          </div>
          <h2 className="text-3xl font-black mb-3">Your cart is empty</h2>
          <Link href="/" className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl font-bold">
            <IoArrowBackOutline /> Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white border-b py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black">Your Cart</h1>
          <p className="text-gray-500 mt-2 font-bold">{cartItems.length} items selected</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
      
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Free Shipping</span>
                <span>{subtotal >= SHIPPING_THRESHOLD ? "Unlocked" : `$${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} left`}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress}%` }} className={`h-full ${subtotal >= SHIPPING_THRESHOLD ? "bg-green-500" : "bg-amber-400"}`} />
              </div>
            </div>

  
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div key={item.cartId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-xl p-4 border flex gap-4">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <button onClick={() => removeItem(item.cartId)} className="text-gray-400 hover:text-red-500"><IoTrashOutline size={18} /></button>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQty(item.cartId, -1)} className="px-2 py-1"><IoRemoveOutline /></button>
                        <span className="px-3 font-bold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.cartId, 1)} className="px-2 py-1"><IoAddOutline /></button>
                      </div>
                      <p className="font-black text-indigo-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border sticky top-24 shadow-sm">
              <h2 className="text-xl font-black mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="border-t pt-4 flex justify-between items-end"><span className="font-black text-lg">Total</span><span className="font-black text-2xl text-indigo-900">${total.toFixed(2)}</span></div>
              </div>
              <Link href="/checkout" className="w-full block text-center bg-green-600 text-white py-4 rounded-xl font-black hover:bg-green-700 transition">
                Checkout Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;