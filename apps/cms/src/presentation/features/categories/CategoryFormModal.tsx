"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { categorySchema, type CategoryFormData } from "@/data/schemas/validation.schemas";
import type { Category } from "@/domain/entities/category.entity";
import { useCategories, useCreateCategory, useUpdateCategory } from "../../hooks/useCategories";

interface CategoryFormModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

export function CategoryFormModal({ open, category, onClose }: CategoryFormModalProps) {
  const { data: categories } = useCategories({ limit: 100 });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
      });
    } else {
      reset({
        name: "",
        slug: "",
        parentId: null,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      // Auto-generate slug if not provided
      const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-");

      if (category) {
        await updateMutation.mutateAsync({ id: category.id, data: { ...data, slug } });
        message.success("Category updated successfully");
      } else {
        await createMutation.mutateAsync({ ...data, slug });
        message.success("Category created successfully");
      }
      onClose();
    } catch (error: any) {
      message.error(error.message || "Operation failed");
    }
  };

  // Filter out current category and its children from parent options
  const availableParents = categories?.filter(
    (c) => c.id !== category?.id && c.parentId !== category?.id
  );

  return (
    <Modal
      title={category ? "Edit Category" : "Create Category"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
        <Form.Item
          label='Category Name'
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required
        >
          <Controller
            name='name'
            control={control}
            render={({ field }) => <Input {...field} placeholder='Electronics' />}
          />
        </Form.Item>

        <Form.Item
          label='Slug'
          validateStatus={errors.slug ? "error" : ""}
          help={errors.slug?.message || "Leave empty to auto-generate from name"}
        >
          <Controller
            name='slug'
            control={control}
            render={({ field }) => <Input {...field} placeholder='electronics' />}
          />
        </Form.Item>

        <Form.Item label='Parent Category' help='Select a parent category to create a subcategory'>
          <Controller
            name='parentId'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder='None (Top level)'
                allowClear
                options={[
                  { label: "None (Top level)", value: null },
                  ...(availableParents?.map((c) => ({
                    label: c.name,
                    value: c.id,
                  })) || []),
                ]}
              />
            )}
          />
        </Form.Item>

        <div className='flex justify-end gap-2 mt-6'>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type='primary'
            htmlType='submit'
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {category ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
