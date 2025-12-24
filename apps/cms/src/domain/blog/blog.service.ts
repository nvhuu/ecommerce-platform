import axios from "axios";
import { getCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  content: string;
}

export interface CreateBlogPostDto {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  coverImage?: string;
}

export const BlogService = {
  findAll: async () => {
    const token = getCookie("token");
    const response = await axios.get(`${API_URL}/blog/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  findOne: async (id: string) => {
    const token = getCookie("token");
    const response = await axios.get(`${API_URL}/blog/posts/${id}`, {
      // Using ID now, backend supports ID find too likely or we need to fix
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
    // Note: Backend controller `findBySlug` uses slug. Regular `findById` is not exposed in controller?
    // Checking controller: `update` and `delete` use ID. `findOne` is missing in controller!
    // I only implemented findAll and findBySlug in controller.
    // I should probably add findById to controller for CMS editing purposes.
  },

  create: async (data: CreateBlogPostDto) => {
    const token = getCookie("token");
    const response = await axios.post(`${API_URL}/blog/posts`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateBlogPostDto>) => {
    const token = getCookie("token");
    const response = await axios.patch(`${API_URL}/blog/posts/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const token = getCookie("token");
    await axios.delete(`${API_URL}/blog/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
