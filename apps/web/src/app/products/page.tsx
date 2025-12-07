"use client";

import api from "@/lib/api";
import { Product } from "@/types";
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

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>All Products</h1>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='h-[300px] bg-gray-100 rounded-lg animate-pulse' />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <div key={product.id} className='group cursor-pointer'>
              <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3'>
                <div className='absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200'>
                  Product Image
                </div>
              </div>
              <h3 className='font-medium group-hover:text-blue-600 transition-colors'>
                {product.name}
              </h3>
              <p className='text-gray-500 text-sm mb-2'>{product.category?.name || "Category"}</p>
              <div className='flex items-center justify-between'>
                <span className='font-bold'>${product.price}</span>
                <button className='text-blue-600 text-sm hover:underline'>Add to Cart</button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className='text-gray-500 col-span-4 text-center py-10'>No products available.</p>
          )}
        </div>
      )}
    </div>
  );
}
