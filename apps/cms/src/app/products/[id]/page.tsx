"use client";

import { ProductForm } from "@/components/ProductForm";
import api from "@/lib/api";
import { Product } from "@/types";
import { use, useEffect, useState } from "react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get<Product>(`/products/${resolvedParams.id}`);
        setProduct(response as any);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>Edit Product</h1>
      <ProductForm initialData={product} />
    </div>
  );
}
