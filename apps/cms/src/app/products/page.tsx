"use client";

import api from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>("/products");
      setProducts(response as any);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Products</h1>
        <Link
          href='/products/create'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Add Product
        </Link>
      </div>

      <div className='bg-white rounded-lg border shadow-sm'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Price</th>
              <th className='px-6 py-3'>Stock</th>
              <th className='px-6 py-3'>Category</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className='bg-white border-b hover:bg-gray-50'>
                <td className='px-6 py-4 font-medium text-gray-900'>{product.name}</td>
                <td className='px-6 py-4'>${product.price}</td>
                <td className='px-6 py-4'>{product.stock}</td>
                <td className='px-6 py-4'>{product.category?.name || "-"}</td>
                <td className='px-6 py-4 space-x-2'>
                  <Link href={`/products/${product.id}`} className='text-blue-600 hover:underline'>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className='text-red-600 hover:underline'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className='px-6 py-4 text-center'>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
