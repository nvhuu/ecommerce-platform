"use client";
/* eslint-disable @next/next/no-img-element */

import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import api from "@/lib/api";
import { useCart } from "@/providers/CartProvider";
import {
  CarOutlined,
  MinusOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className='h-screen flex items-center justify-center'>Loading...</div>;
  if (!product)
    return <div className='h-screen flex items-center justify-center'>Product not found</div>;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0],
      quantity,
    });
  };

  return (
    <div className='container mx-auto px-4 py-8 md:py-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20'>
        {/* Gallery */}
        <div className='space-y-4'>
          <div className='aspect-square bg-gray-100 rounded-2xl overflow-hidden relative'>
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400'>
                No Image
              </div>
            )}
          </div>

          <div className='grid grid-cols-4 gap-4'>
            {product.images?.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-black ring-1 ring-black/20" : "border-transparent"}`}
              >
                <img src={img} alt={`View ${idx}`} className='w-full h-full object-cover' />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className='flex flex-col'>
          <div className='mb-2'>
            <span className='text-blue-600 font-medium text-sm tracking-wider uppercase'>
              {product.category?.name || "Premium Collection"}
            </span>
          </div>
          <h1 className='text-4xl font-bold mb-4 leading-tight'>{product.name}</h1>

          <div className='flex items-center gap-4 mb-6'>
            <div className='flex text-yellow-500'>
              {[1, 2, 3, 4, 5].map((s) => (
                <StarFilled key={s} style={{ fontSize: 18 }} />
              ))}
            </div>
            <span className='text-gray-500 text-sm'>(42 Reviews)</span>
          </div>

          <div className='text-3xl font-semibold mb-8'>${Number(product.price).toFixed(2)}</div>

          <p className='text-gray-600 leading-relaxed mb-8 border-b pb-8'>{product.description}</p>

          <div className='space-y-6 mb-8'>
            <div className='flex items-center justify-between max-w-xs'>
              <span className='font-medium text-gray-900'>Quantity</span>
              <div className='flex items-center border rounded-lg'>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='p-3 hover:bg-gray-50'
                >
                  <MinusOutlined style={{ fontSize: 16 }} />
                </button>
                <span className='w-12 text-center font-medium'>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className='p-3 hover:bg-gray-50'>
                  <PlusOutlined style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>

            <div className='flex gap-4'>
              <button
                onClick={handleAddToCart}
                className='flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition-transform active:scale-95 flex items-center justify-center gap-2'
              >
                <ShoppingOutlined style={{ fontSize: 20 }} /> Add to Cart
              </button>
              {/* Wishlist Button Placeholder */}
              <button className='p-4 border rounded-full hover:bg-gray-50 transition-colors'>
                <StarOutlined style={{ fontSize: 20 }} />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm text-gray-500'>
            <div className='flex items-center gap-3'>
              <CarOutlined style={{ fontSize: 20 }} className='text-gray-900' />
              <span>Free Shipping & Returns</span>
            </div>
            <div className='flex items-center gap-3'>
              <SafetyCertificateOutlined style={{ fontSize: 20 }} className='text-gray-900' />
              <span>Lifetime Warranty</span>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-20'>
        <h2 className='text-2xl font-bold mb-8'>Customer Reviews</h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          <div>
            <ReviewsList productId={id as string} />
          </div>
          <div>
            <ReviewForm productId={id as string} />
          </div>
        </div>
      </div>
    </div>
  );
}
