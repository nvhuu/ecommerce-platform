"use client";

import api from "@/lib/api";
import { Category, Product } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || "",
    images: initialData?.images || [], // For now just basic array, maybe not editable in UI fully yet
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>("/categories");
      setCategories(response as any);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await api.patch(`/products/${initialData.id}`, formData);
      } else {
        await api.post("/products", { ...formData, images: [] }); // Default empty images
      }
      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Failed to save product");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 max-w-2xl bg-white p-6 rounded-lg border shadow-sm'
    >
      <div>
        <label className='block text-sm font-medium text-gray-700'>Name</label>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          required
          className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Description</label>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Price ($)</label>
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={handleChange}
            required
            step='0.01'
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Stock</label>
          <input
            type='number'
            name='stock'
            value={formData.stock}
            onChange={handleChange}
            required
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Category</label>
        <select
          name='categoryId'
          value={formData.categoryId}
          onChange={handleChange}
          required
          className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        >
          <option value=''>Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className='flex justify-end pt-4'>
        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
