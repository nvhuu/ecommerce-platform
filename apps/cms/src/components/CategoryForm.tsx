"use client";

import api from "@/lib/api";
import { Category } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryFormProps {
  initialData?: Category;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    parentId: initialData?.parentId || "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>("/categories");
      // Filter out self if editing to prevent self-parenting
      const allCats = response as any as Category[];
      setCategories(initialData ? allCats.filter((c) => c.id !== initialData.id) : allCats);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await api.patch(`/categories/${initialData.id}`, formData);
      } else {
        await api.post("/categories", formData);
      }
      router.push("/categories");
      router.refresh(); // Refresh server data if any
    } catch (error) {
      console.error("Failed to save category", error);
      alert("Failed to save category");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 max-w-lg bg-white p-6 rounded-lg border shadow-sm'
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
        <label className='block text-sm font-medium text-gray-700'>Slug</label>
        <input
          type='text'
          name='slug'
          value={formData.slug}
          onChange={handleChange}
          required
          className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Parent Category</label>
        <select
          name='parentId'
          value={formData.parentId || ""}
          onChange={handleChange}
          className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        >
          <option value=''>None</option>
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
          {loading ? "Saving..." : "Save Category"}
        </button>
      </div>
    </form>
  );
}
