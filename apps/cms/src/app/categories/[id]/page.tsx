"use client";

import { CategoryForm } from "@/components/CategoryForm";
import api from "@/lib/api";
import { Category } from "@/types";
import { use, useEffect, useState } from "react";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get<Category>(`/categories/${resolvedParams.id}`);
        setCategory(response as any);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch category", error);
        setLoading(false);
      }
    };
    fetchCategory();
  }, [resolvedParams.id]);

  if (loading) return <div>Loading...</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>Edit Category</h1>
      <CategoryForm initialData={category} />
    </div>
  );
}
