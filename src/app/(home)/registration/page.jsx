"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { 
  IoMailOutline, IoLockClosedOutline, IoPersonOutline, 
  IoCloudUploadOutline, IoLinkOutline 
} from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

const RegistrationPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const imgbb_api_key = process.env.NEXT_PUBLIC_IMGBB_KEY;

   useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
       if (preview) URL.revokeObjectURL(preview);
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      Toast.fire({ icon: "error", title: "Max size 2MB" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    let photo = formData.get("photo") || "";

    try {
      if (activeTab === "upload" && selectedFile) {
        const imgData = new FormData();
        imgData.append("image", selectedFile);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbb_api_key}`, imgData);
        photo = res.data.data.display_url;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, image: photo }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginRes.ok) {
          Toast.fire({ icon: "success", title: "Registration & Login Successful!" });
          router.push("/");
          router.refresh();
        }
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">Create Account</h2>
          <p className="text-gray-500 font-medium mt-2">Join our organic food community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input name="name" type="text" required className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 font-medium transition-all" placeholder="Full Name" />
          </div>

          <div className="space-y-3">
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              {["upload", "url"].map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-green-600 shadow-sm" : "text-gray-500"}`}>
                  {tab}
                </button>
              ))}
            </div>

                  {activeTab === "upload" ? (
              <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 overflow-hidden">
                {preview ? (
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="text-center">
                    <IoCloudUploadOutline className="mx-auto text-2xl text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Upload Photo</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="relative">
                <IoLinkOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input name="photo" type="url" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 font-medium transition-all" placeholder="Image URL" />
              </div>
            )}
          </div>

          <div className="relative">
            <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input name="email" type="email" required className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 font-medium transition-all" placeholder="Email" />
          </div>

          <div className="relative">
            <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input name="password" type="password" required className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 font-medium transition-all" placeholder="Password" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100 disabled:bg-gray-400">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative px-4 bg-white text-xs text-gray-400 font-bold uppercase tracking-widest">Or continue with</span>
        </div>

        <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all">
          <FcGoogle size={24} /> Google
        </button>

        <p className="text-center mt-6 text-gray-600 font-medium">
          Already have an account? <Link href="/login" className="text-green-600 font-black hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;