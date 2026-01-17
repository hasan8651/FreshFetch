"use client";

import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";

const ManageProducts = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Vegetables", "Fruits", "Dairy", "Bakery"];
  const isRestrictedAdmin = session?.user?.email === "admin@freshfetch.com";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: search,
        category: category,
      };

      const res = await axiosInstance.get("/products", { params });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, category, search]);

  const handleDelete = async (id) => {
    if (isRestrictedAdmin) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.delete(`/products/${id}`);
          if (res.data.result.deletedCount > 0) {
            Swal.fire("Deleted!", "Product has been deleted.", "success");
            fetchProducts();
          }
        } catch (error) {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      }
    });
  };

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        
           <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Manage Products
              </h2>
              <p className="text-gray-500 text-sm">
                Total Products Found: {products.length}
                {isRestrictedAdmin && " (View Only Mode)"}
              </p>
            </div>
            {isRestrictedAdmin ? (
              <button
                disabled
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-300 text-white px-5 py-2.5 rounded-lg shadow-sm cursor-not-allowed"
              >
                <FaPlus /> Add New Product
              </button>
            ) : (
              <Link
                href="/dashboard/admin-manger/add-products"
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md active:scale-95"
              >
                <FaPlus /> Add New Product
              </Link>
            )}
          </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="relative w-full flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="w-full lg:w-48 p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Image</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Name & SKU</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Category</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Stock</th>
                <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Price</th>
                <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 font-medium">
                    <span className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-green-600 rounded-full" role="status"></span>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover border"
                      />
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 max-w-[150px] truncate md:max-w-xs">{product.name}</div>
                      <div className="text-[10px] md:text-xs text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 md:px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${product.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm font-bold text-green-600">${product.price}</td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <Link href={`/dashboard/admin/product-details/${product._id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <FaEye size={16} />
                        </Link>
                        {!isRestrictedAdmin && (
                          <>
                            <Link href={`/dashboard/admin/update-product/${product._id}`} className="text-amber-500 hover:text-amber-700">
                              <FaEdit size={16} />
                            </Link>
                            <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700">
                              <FaTrashAlt size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

   
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <p className="text-xs md:text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 text-sm transition-colors"
            >
              Prev
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 border rounded-lg text-xs md:text-sm transition-all ${
                    currentPage === index + 1 ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;