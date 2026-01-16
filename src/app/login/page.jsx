"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { IoLogoGoogle, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Swal from "sweetalert2";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {

    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] px-4 py-12 relative overflow-hidden">

      <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative z-10"
      >
        <div className="text-center">
          <h2 className="text-4xl font-black text-green-600 tracking-tighter">
            Fresh<span className="text-gray-900">Fetch</span>
          </h2>
          <p className="mt-3 text-sm text-gray-400 font-medium">Welcome back! Please enter your details.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
        
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all text-sm font-medium"
                placeholder="Email address"
              />
            </div>
            
         
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-green-500 transition-all text-sm font-medium"
                placeholder="Password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" size="sm" className="text-xs font-bold text-gray-400 hover:text-green-600 transition-colors">
                Forgot Password?
            </Link>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center">
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-2xl font-black text-sm transition-all transform active:scale-95 shadow-xl shadow-green-100 flex items-center justify-center`}
          >
            {loading ? "Authenticating..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="px-4 bg-white text-gray-400">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3.5 border border-gray-100 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95 text-gray-700"
        >
          <IoLogoGoogle className="text-rose-500" size={18} />
          Google Account
        </button>

        <p className="text-center text-xs font-bold text-gray-400 mt-8">
          Don't have an account?{" "}
          <Link href="/register" className="text-green-600 hover:text-green-700 underline underline-offset-4 ml-1">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;