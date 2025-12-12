"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
// @ts-ignore
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
// @ts-ignore
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const { data, isLoading } = useQuery({
    queryKey: ["products", category, search],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (category) params.category = category; // Assuming API supports filter by category ID/slug
      if (search) params.search = search;

      const res = await api.get("/products", { params });
      return res.data.data;
    },
  });

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header & Filters */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : "All Products"}
          </h1>
          <p className='text-gray-500 mt-1'>
            {isLoading ? "Loading..." : `${data?.length || 0} items`}
          </p>
        </div>

        <div className='flex gap-2'>
          <button className='flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50'>
            <Filter size={18} /> Filter
          </button>
          <button className='flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50'>
            <SlidersHorizontal size={18} /> Sort
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10'>
        {isLoading
          ? // Skeleton Loaders
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='bg-gray-200 aspect-[3/4] rounded-lg mb-4' />
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
                <div className='h-4 bg-gray-200 rounded w-1/4' />
              </div>
            ))
          : data?.map((product: any) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className='group cursor-pointer block'
              >
                <div className='relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4'>
                  {/* Image Placeholder */}
                  {product.images && product.images[0] ? (
                    <div className='relative w-full h-full'>
                      {/* Using standard img for now to verify functionality quickly without domain config */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500'
                      />
                    </div>
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-400 bg-gray-50'>
                      No Image
                    </div>
                  )}

                  {/* Quick Add Button (Optional on hover) */}
                  <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button className='bg-white p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors'>
                      <span className='sr-only'>Quick View</span>
                      <ChevronDown size={20} className='rotate-[-90deg]' />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className='font-medium text-gray-900 group-hover:text-blue-600 transition-colors'>
                    {product.name}
                  </h3>
                  <p className='text-gray-500 mt-1'>${Number(product.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
      </div>

      {!isLoading && (!data || data.length === 0) && (
        <div className='text-center py-20 text-gray-500'>No products found.</div>
      )}
    </div>
  );
}
