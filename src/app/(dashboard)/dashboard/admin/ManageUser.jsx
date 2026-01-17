"use client";

import React, { useEffect, useState } from "react";
import { FiUser, FiShield, FiStar, FiSearch, FiFilter } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";

const roles = ["all", "user", "manager", "admin"];

const ManageUsers = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const limit = 10;

    const isRestrictedAdmin = session?.user?.email === "admin@freshfetch.com";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/users?page=1&limit=1000`);
      setUsers(res.data.result || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setSearchLoading(true);

    const applyFilters = () => {
      let temp = [...users];

      if (search.trim()) {
        const s = search.toLowerCase();
        temp = temp.filter(
          (u) =>
            (u.fullName && u.fullName.toLowerCase().includes(s)) ||
            (u.email && u.email.toLowerCase().includes(s))
        );
      }

      if (roleFilter !== "all") {
        temp = temp.filter((u) => u.role === roleFilter);
      }

      const calculatedTotalPages = Math.ceil(temp.length / limit);
      setTotalPages(calculatedTotalPages || 1);

      const start = (page - 1) * limit;
      const end = start + limit;
      setFilteredUsers(temp.slice(start, end));

      setSearchLoading(false);
    };

    const delay = setTimeout(applyFilters, 400);
    return () => clearTimeout(delay);
  }, [users, search, roleFilter, page]);

  const updateRole = async (id, role) => {
    if (isRestrictedAdmin) {
      toast.error("Restricted Admin cannot update roles!", {
        style: { borderRadius: '15px', background: '#333', color: '#fff' }
      });
      return;
    }

    try {
      setUpdatingId(id);
      await axiosInstance.patch(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success(`Role updated to ${role.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching User Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <Toaster position="top-right" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
            Manage <span className="text-indigo-600">Users</span>
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-1">
            {isRestrictedAdmin ? "🔐 Read-Only Access Mode" : "⚡ Real-time Access Control"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72 group">
             <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
             <input
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Name or Email..."
                className="w-full pl-12 pr-5 py-4 rounded-[1.5rem] border border-gray-100 bg-white text-xs font-bold focus:ring-4 focus:ring-indigo-50 shadow-sm outline-none transition-all placeholder:text-gray-300"
              />
          </div>
          
          <div className="relative w-full sm:w-auto">
             <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
             <select
                value={roleFilter}
                onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}
                className="w-full sm:w-auto pl-10 pr-10 py-4 rounded-[1.5rem] border border-gray-100 bg-white text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-50 shadow-sm outline-none cursor-pointer appearance-none"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden relative">
        <AnimatePresence>
            {searchLoading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Filtering</span>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Member</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Level</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Registry Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-indigo-50/10 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                            <Image
                              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.fullName}&background=random`}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-[1.2rem] object-cover ring-4 ring-gray-50 group-hover:ring-white transition-all shadow-sm"
                              alt={user.fullName}
                            />
                            {user.role === 'admin' && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 text-xs uppercase tracking-tight">{user.fullName}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        user.role === "admin" ? "bg-red-500 text-white" : 
                        user.role === "manager" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-center gap-3">
                        <RoleButton 
                            active={user.role === "user"} 
                            onClick={() => updateRole(user._id, "user")}
                            icon={<FiUser size={14} />}
                            disabled={updatingId === user._id || isRestrictedAdmin}
                            color="hover:bg-gray-900"
                        />
                        <RoleButton 
                            active={user.role === "manager"} 
                            onClick={() => updateRole(user._id, "manager")}
                            icon={<FiShield size={14} />}
                            disabled={updatingId === user._id || isRestrictedAdmin}
                            color="hover:bg-indigo-600"
                        />
                        <RoleButton 
                            active={user.role === "admin"} 
                            onClick={() => updateRole(user._id, "admin")}
                            icon={<FiStar size={14} />}
                            disabled={updatingId === user._id || isRestrictedAdmin}
                            color="hover:bg-red-600"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-32 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                        <FiUser size={40} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No records match your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

             <div className="px-10 py-8 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Displaying Page <span className="text-indigo-600">{page}</span> of {totalPages}
          </p>
          <div className="flex gap-3">
            <PaginationButton onClick={() => setPage(p => p - 1)} disabled={page === 1} label="Previous" />
            <PaginationButton onClick={() => setPage(p => p + 1)} disabled={page === totalPages || totalPages === 0} label="Next" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleButton = ({ active, onClick, icon, disabled, color }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`p-3 rounded-2xl border transition-all duration-300 shadow-sm ${
        active 
          ? "bg-gray-900 text-white border-gray-900 scale-110 shadow-xl" 
          : `bg-white text-gray-400 border-gray-100 ${color} hover:text-white hover:-translate-y-1`
      } ${disabled && !active ? "opacity-20 cursor-not-allowed" : ""}`}
    >
      {icon}
    </button>
);

const PaginationButton = ({ onClick, disabled, label }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-6 py-3 bg-white border border-gray-100 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 transition-all shadow-sm active:scale-95"
    >
      {label}
    </button>
);

export default ManageUsers;