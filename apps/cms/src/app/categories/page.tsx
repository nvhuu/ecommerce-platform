"use client";

import api from "@/lib/api";
import { Category } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>("/categories");
      setCategories(response as any); // Axios response.data is returned by interceptor
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Categories</h1>
        <Link
          href='/categories/create'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Add Category
        </Link>
      </div>

      <div className='bg-white rounded-lg border shadow-sm'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-6 py-3'>Name</th>
              <th className='px-6 py-3'>Slug</th>
              <th className='px-6 py-3'>Parent</th>
              <th className='px-6 py-3'>Created At</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className='bg-white border-b hover:bg-gray-50'>
                <td className='px-6 py-4 font-medium text-gray-900'>{category.name}</td>
                <td className='px-6 py-4'>{category.slug}</td>
                <td className='px-6 py-4'>{category.parent?.name || "-"}</td>
                <td className='px-6 py-4'>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td className='px-6 py-4 space-x-2'>
                  <Link
                    href={`/categories/${category.id}`}
                    className='text-blue-600 hover:underline'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className='text-red-600 hover:underline'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className='px-6 py-4 text-center'>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
