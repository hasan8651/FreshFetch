"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CheckoutForm = ({ total, formData, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    if (!formData.fullName || !formData.email || !formData.phone || !formData.city || !formData.address) {
      toast.error("Please fill in all shipping information first");
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setLoading(true);

    try {
       const res = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total,
          email: formData.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment intent failed");

      const clientSecret = data.clientSecret;

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: formData.fullName,
            email: formData.email,
          },
        },
      });

      if (confirmError) {
        toast.error(confirmError.message);
        setLoading(false);
        return;
      }

        if (paymentIntent.status === "succeeded") {
        const orderInfo = {
          email: formData.email,
          products: cartItems,
          total: total,
          paymentMethod: "Stripe",
          transactionId: paymentIntent.id,
          shippingAddress: formData,
        };

        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderInfo),
        });

        if (orderResponse.ok) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("storage")); 
            window.dispatchEvent(new Event("cart-updated"));
          }
          toast.success("Payment Successful!");
          router.push("/order-success");
        } else {
          throw new Error("Payment succeeded but order saving failed.");
        }
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong during payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-xl bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                fontFamily: "Inter, sans-serif",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || loading}
        className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-lg active:scale-[0.98] ${
          loading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer shadow-indigo-100"
        }`}
      >
        {loading ? "Processing..." : `Pay $${total.toFixed(2)} Now`}
      </button>
    </div>
  );
};

export default CheckoutForm;