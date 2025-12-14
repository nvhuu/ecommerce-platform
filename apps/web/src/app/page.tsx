"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/lib/api";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
// @ts-expect-error -- framer motion types
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data;
    },
  });

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10' />
          {/* Abstract Background or Image */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
        </div>

        <div className='relative z-20 container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='max-w-2xl'
          >
            <h1 className='text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight'>
              Elevate Your <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600'>
                Lifestyle.
              </span>
            </h1>
            <p className='text-lg md:text-xl text-gray-300 mb-8 max-w-lg'>
              Discover a curated collection of premium products designed for the modern connoisseur.
              Uncompromising quality, timeless style.
            </p>
            <div className='flex gap-4'>
              <Link
                href='/products'
                className='bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center gap-2'
              >
                Shop Now <ArrowRightOutlined style={{ fontSize: 18 }} />
              </Link>
              <Link
                href='/about'
                className='border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors'
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-end mb-12'>
            <div>
              <h2 className='text-3xl font-bold mb-2'>Shop by Category</h2>
              <p className='text-gray-500'>Explore our wide range of collections</p>
            </div>
            <Link
              href='/products'
              className='text-blue-600 font-medium hover:underline flex items-center gap-1'
            >
              View All <ArrowRightOutlined style={{ fontSize: 16 }} />
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {categories?.slice(0, 3).map((category: any, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='group relative h-80 rounded-2xl overflow-hidden cursor-pointer'
              >
                <div className='absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10' />
                {/* Fallback pattern if no image */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)}`} />

                <div className='absolute bottom-0 left-0 p-8 z-20 w-full'>
                  <h3 className='text-2xl font-bold text-white mb-2'>{category.name}</h3>
                  <div className='h-0 group-hover:h-6 overflow-hidden transition-all duration-300'>
                    <span className='text-white/90 text-sm flex items-center gap-2'>
                      Explore Collection <ArrowRightOutlined style={{ fontSize: 14 }} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products (Placeholder) */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-12 text-center'>Trending Now</h2>
          {/* Product Grid would go here */}
          <div className='text-center text-gray-500 py-12 bg-gray-50 rounded-xl border border-dashed'>
            Products will be loaded here from the API...
          </div>
        </div>
      </section>
    </div>
  );
}

function getGradient(index: number) {
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-orange-500 to-yellow-400",
    "from-green-500 to-emerald-400",
  ];
  return gradients[index % gradients.length];
}
