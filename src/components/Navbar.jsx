"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoHeartOutline,
  IoCartOutline,
  IoMenuOutline,
  IoCallOutline,
  IoChevronDownOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";

const getCartCountFromStorage = () => {
  if (typeof window === "undefined") return 0;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  useEffect(() => {
    setCartCount(getCartCountFromStorage());
    const handleStorageChange = () => setCartCount(getCartCountFromStorage());
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleStorageChange);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/all-groceries?search=${searchTerm}`);
      setSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/", dropdown: null },
    { name: "All Groceries", path: "/all-groceries", dropdown: null },
    {
      name: "Category",
      path: null,
      dropdown: [
        { name: "All Groceries", path: "/all-groceries" },
        { name: "Vegetables", path: "/all-groceries?category=Vegetables" },
        { name: "Fruits", path: "/all-groceries?category=Fruits" },
        { name: "Dairy", path: "/all-groceries?category=Dairy" },
        { name: "Beverages", path: "/all-groceries?category=Beverages" },
      ],
    },
    { name: "About", path: "/about", dropdown: null },
    { name: "Services", path: "/services", dropdown: null },
    { name: "Contact", path: "/contact", dropdown: null },
  ];

  return (
    <>
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-[100] shadow-sm"
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-gray-800 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          >
            <IoMenuOutline size={30} />
          </motion.button>

          {/* Logo Section */}
          <Link href="/" className="shrink-0">
            <Image 
                src="/logo.png" 
                alt="FreshFetch Logo" 
                width={180} 
                height={50} 
                className="w-32 md:w-44 object-contain"
                priority unoptimized
            />
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl items-center border-2 border-gray-100 rounded-full focus-within:border-green-500 transition-all ml-4 overflow-hidden">
            <input
              type="text"
              placeholder="Search for organic products..."
              className="flex-1 px-5 py-2 outline-none text-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-green-600 p-3 px-6 hover:bg-green-700 text-white transition-colors">
              <IoSearchOutline size={22} />
            </button>
          </form>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {status === "authenticated" ? (
                  <>
                    <div onClick={() => setProfileDropdown(!profileDropdown)} className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer overflow-hidden active:scale-95 transition-all">
                      <Image
                        src={user?.image || "https://i.ibb.co/vBR74KV/user.png"} 
                        alt="Profile" 
                        width={40}  
  height={40}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <AnimatePresence>
                      {profileDropdown && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[110]">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                              <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <Link href="/profile" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all font-medium text-sm">
                              <IoPersonOutline size={18} /> View Profile
                            </Link>
                            <Link href="/dashboard" onClick={() => setProfileDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all font-medium text-sm">
                              <IoSettingsOutline size={18} /> Dashboard
                            </Link>
                            <button onClick={() => { signOut(); setProfileDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-all font-medium text-sm">
                              <IoLogOutOutline size={18} /> Log Out
                            </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link href="/login">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-600 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                      <IoPersonOutline size={22} />
                    </div>
                  </Link>
                )}
              </div>
              
              <Link href="/wishlist" className="relative cursor-pointer hover:text-red-600">
                <IoHeartOutline size={26} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">0</span>
              </Link>

              <Link href="/cart" className="relative cursor-pointer hover:text-green-600">
                <IoCartOutline size={26} />
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Links with Active Class */}
        <nav className="hidden lg:block border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <ul className="flex items-center gap-8 font-semibold text-gray-700">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.path || (link.dropdown && link.dropdown.some(sub => pathname === sub.path));
                
                return (
                  <li key={idx} className="relative group py-5">
                    {link.path ? (
                      <Link 
                        href={link.path} 
                        className={`flex items-center gap-1 transition-colors ${isActive ? "text-green-600 border-b-2 border-green-600" : "hover:text-green-600"}`}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <span className={`flex items-center gap-1 cursor-pointer transition-colors ${isActive ? "text-green-600" : "hover:text-green-600"}`}>
                        {link.name} <IoChevronDownOutline className="text-sm group-hover:rotate-180 transition-transform duration-300" />
                      </span>
                    )}
                    {link.dropdown && (
                      <div className="absolute top-full left-0 min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-50 p-2">
                        {link.dropdown.map((sub, sIdx) => (
                          <motion.div key={sIdx} whileHover={{ x: 5 }}>
                            <Link 
                                href={sub.path} 
                                className={`block py-2 px-3 text-sm rounded-md ${pathname === sub.path ? "text-green-600 bg-green-50 font-bold" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`}
                            >
                              {sub.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Weekly Discount & Hotline */}
            <div className="flex items-center gap-8">
               <motion.div 
                 animate={{ scale: [1, 1.05, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }} 
                 className="flex items-center gap-2 text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100"
               >
                 <span className="bg-green-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-[12px]">%</span>
                 <span>Weekly Discount!</span>
               </motion.div>

               <div className="bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-3 shadow-lg shadow-indigo-100">
                 <IoCallOutline size={22} className="animate-pulse" />
                 <div className="leading-tight">
                   <p className="text-[10px] opacity-80 uppercase font-medium">Hotline 24/7</p>
                   <p className="font-bold">+880 1718047653</p>
                 </div>
               </div>
            </div>
          </div>
        </nav>
      </motion.header>
      <div className="h-20 lg:h-[145px]"></div>
    </>
  );
};

export default Navbar;