"use client";

import React, { useEffect, useState, useContext } from "react";
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaSearch, FaBoxOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import Link from "next/link";

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchMyProducts = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
 
      const params = {
        page: currentPage,
        limit: 10,
        search: search,
        email: user.email
      };

      const res = await axiosInstance.get("/products", { params });

      if (res.data.products) {

        const myData = res.data.products.filter(
          (item) => item.addedBy?.email === user.email
        );
        setProducts(myData);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [currentPage, search, user?.email]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Product will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl px-6 py-3',
        cancelButton: 'rounded-xl px-6 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(`/products/${id}`);
          if (res.data.result.deletedCount > 0) {
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
            fetchMyProducts();
          }
        } catch (error) {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  return (
    <div className="p-4 md:p-10 bg-[#F8F9FD] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              Inventory <span className="text-indigo-600">Stock</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
              Managing: {user?.email}
            </p>
          </div>
          <Link
            href="/dashboard/admin-manger/add-products"
            className="flex items-center gap-3 bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <FaPlus /> Add New Product
          </Link>
        </header>

  
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="relative group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50/50 border border-transparent focus:bg-white focus:border-indigo-100 outline-none font-bold text-sm transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>


        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Fetching your catalog...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                         <FaBoxOpen size={50} />
                         <span className="text-sm font-black uppercase tracking-widest">No products in your vault</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl overflow-hidden border border-gray-100 shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500">
                             <img className="h-full w-full object-cover" src={product.thumbnail} alt={product.name} />
                          </div>
                          <div>
                            <div className="text-sm font-black text-gray-900 tracking-tight">{product.name}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">SKU: {product.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-gray-500 uppercase bg-gray-100 px-3 py-1.5 rounded-lg tracking-widest">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-lg font-black text-gray-900 tracking-tighter">${product.price}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                           <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                           {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
                        </div>
                      </td> 
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <Link href={`/dashboard/admin/product-details/${product._id}`} className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                            <FaEye size={16} />
                          </Link>
                          <Link href={`/dashboard/admin/update-product/${product._id}`} className="w-10 h-10 bg-gray-50 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-all">
                            <FaEdit size={16} />
                          </Link>
                          <button onClick={() => handleDelete(product._id)} className="w-10 h-10 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-10">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Catalog Overview: {products.length} Products Found
          </p>
          <div className="flex gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-white border border-gray-100 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm active:scale-90"
            >
              Previous
            </button>
            <div className="flex items-center px-4 font-black text-sm text-gray-900">
               {currentPage} / {totalPages}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-white border border-gray-100 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm active:scale-90"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;