"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  IoPersonOutline, IoMailOutline, 
  IoCheckmarkCircleOutline, IoCloudUploadOutline, IoLinkOutline 
} from "react-icons/io5";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhotoURL(session.user.image || "https://i.ibb.co/vBR74KV/user.png");
    }
  }, [session]);

  const isRestrictedAdmin = session?.user?.email === "admin@freshfetch.com";
  const imgbb_api_key = process.env.NEXT_PUBLIC_IMGBB_KEY;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return Toast.fire({ icon: "error", title: "File too large (Max 5MB)" });
      }
      setSelectedFile(file);
        setPhotoURL(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isRestrictedAdmin) return;
    setLoading(true);

    try {
      let finalPhotoURL = photoURL;

         if (activeTab === "upload" && selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbb_api_key}`, formData);
        finalPhotoURL = res.data.data.display_url;
        setUploading(false);
      }

        const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        body: JSON.stringify({ name, image: finalPhotoURL }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Database update failed");

         await update({
        ...session,
        user: {
          ...session?.user,
          name: name,
          image: finalPhotoURL,
        },
      });
      
      Toast.fire({ icon: "success", title: "Profile updated successfully" });
      setSelectedFile(null);
    } catch (error) {
      Toast.fire({ icon: "error", title: error.message || "Update failed" });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 ${
          isRestrictedAdmin ? "opacity-80 pointer-events-none" : ""
        }`}
      >
        <div className="h-32 bg-gradient-to-r from-green-500 to-indigo-600"></div>

        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative w-32 h-32">
              <Image
                src={photoURL || "https://i.ibb.co/vBR74KV/user.png"}
                alt="Profile"
                fill
                sizes="128px"
                className="rounded-full border-4 border-white object-cover shadow-lg bg-white"
                priority unoptimized
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">{session?.user?.name || "User"}</h2>
            <p className="text-gray-500 font-medium">{session?.user?.email}</p>
            {isRestrictedAdmin && (
              <span className="text-xs text-red-500 font-bold mt-2 inline-block">Admin profile is locked for demo</span>
            )}
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
    
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <div className="relative">
                <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all font-medium text-gray-700"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

      
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Email (Read Only)</label>
              <div className="relative">
                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-400 cursor-not-allowed"
                />
                <IoCheckmarkCircleOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              </div>
            </div>

      
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">Profile Photo Update</label>
              <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "upload" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}
                >
                  <IoCloudUploadOutline className="inline mr-1" /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("url")}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "url" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500"}`}
                >
                  <IoLinkOutline className="inline mr-1" /> URL
                </button>
              </div>

              {activeTab === "upload" ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                  <IoCloudUploadOutline size={30} className="text-gray-400 mb-2" />
                  <p className="text-xs font-bold text-gray-500 text-center px-4 line-clamp-1">
                    {selectedFile ? selectedFile.name : "Click to select or drag photo"}
                  </p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="relative">
                  <IoLinkOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500"
                    placeholder="Paste image URL"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-gray-300 disabled:shadow-none active:scale-[0.98]"
            >
              {loading || uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : "Save Changes"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;