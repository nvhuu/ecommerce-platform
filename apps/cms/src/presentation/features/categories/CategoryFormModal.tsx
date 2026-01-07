"use client";

import type { Category } from "@/domain/entities/category.entity";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useCategories, useCreateCategory, useUpdateCategory } from "../../hooks/useCategories";

interface CategoryFormModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

interface CategoryFormValues {
  name: string;
  slug: string;
  parentId: string | null;
}

export function CategoryFormModal({ open, category, onClose }: CategoryFormModalProps) {
  const [form] = Form.useForm<CategoryFormValues>();
  const { data: categories } = useCategories({ limit: 100 });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  useEffect(() => {
    if (open) {
      if (category) {
        form.setFieldsValue({
          name: category.name,
          slug: category.slug,
          parentId: category.parentId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [category, open, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      // Auto-generate slug if not provided
      const slug = values.slug || values.name.toLowerCase().replace(/\s+/g, "-");

      if (category) {
        await updateMutation.mutateAsync({
          id: category.id,
          data: {
            name: values.name,
            slug,
            parentId: values.parentId,
          },
        });
        message.success("Category updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          slug,
          parentId: values.parentId,
        });
        message.success("Category created successfully");
      }
      onClose();
    } catch (error: unknown) {
      message.error((error as Error).message || "Operation failed");
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
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        initialValues={{
          name: "",
          slug: "",
          parentId: null,
        }}
      >
        <Form.Item
          label='Category Name'
          name='name'
          rules={[
            { required: true, message: "Please enter category name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder='Electronics' />
        </Form.Item>

        <Form.Item label='Slug' name='slug' help='Leave empty to auto-generate from name'>
          <Input placeholder='electronics' />
        </Form.Item>

        <Form.Item
          label='Parent Category'
          name='parentId'
          help='Select a parent category to create a subcategory'
        >
          <Select
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
      </Form>
    </Modal>
  );
}
