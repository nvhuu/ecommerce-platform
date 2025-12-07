"use client";

import api from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>("/products");
      setProducts(response as any); // Correctly type cast via interceptor logic if needed, but here raw axios data is standard unless intercepted
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setLoading(false);
    }
  };

  return (
    <div className='space-y-12 pb-12'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>Summer Collection 2025</h1>
          <p className='text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Discover the latest trends in fashion and accessories. Premium quality, sustainable
            materials, and timeless designs.
          </p>
          <div className='flex justify-center gap-4'>
            <Link
              href='/products'
              className='bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2'
            >
              <ShoppingBag className='w-5 h-5' />
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='container mx-auto px-4'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold'>Featured Products</h2>
          <Link
            href='/products'
            className='text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium'
          >
            View All <ArrowRight className='w-4 h-4' />
          </Link>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='h-[300px] bg-gray-100 rounded-lg animate-pulse' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className='group cursor-pointer'>
                <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3'>
                  {/* Placeholder for real image or dynamic image from DB */}
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
      </section>

      {/* Newsletter / Footer Promo */}
      <section className='bg-gray-50 py-16'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-2xl font-bold mb-4'>Stay Updated</h2>
          <p className='text-gray-600 mb-6'>
            Subscribe to our newsletter for exclusive offers and updates.
          </p>
          <div className='max-w-md mx-auto flex gap-2'>
            <input
              type='email'
              placeholder='Enter your email'
              className='flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
            <button className='bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800'>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
