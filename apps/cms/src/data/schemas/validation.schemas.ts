import { OrderStatus } from "@/domain/entities/order.entity";
import { UserRole } from "@/domain/entities/user.entity";
import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock must be a positive integer"),
  images: z.array(z.string().url("Invalid image URL")).min(0),
  categoryId: z.string().min(1, "Category is required"),
});

export const createProductSchema = productSchema;
export const updateProductSchema = productSchema.partial();

// Category Schemas
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

export const createCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial();

// Order Schemas
export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

// User Schemas
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.nativeEnum(UserRole).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.nativeEnum(UserRole).optional(),
});

// Media Schemas
export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().nullable().optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type CreateFolderFormData = z.infer<typeof createFolderSchema>;
