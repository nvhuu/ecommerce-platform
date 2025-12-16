"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { productSchema, type ProductFormData } from "@/data/schemas/validation.schemas";
import type { Product } from "@/domain/entities/product.entity";
import { useCategories } from "../../hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProducts";

const { TextArea } = Input;

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

export function ProductFormModal({ open, product, onClose }: ProductFormModalProps) {
  const { data: categories } = useCategories({ limit: 100 });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        images: product.images,
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: "",
        images: [],
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateMutation.mutateAsync({ id: product.id, data });
        message.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        message.success("Product created successfully");
      }
      onClose();
    } catch (error: any) {
      message.error(error.message || "Operation failed");
    }
  };

  return (
    <Modal
      title={product ? "Edit Product" : "Create Product"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
        <Form.Item
          label='Product Name'
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name='name'
            control={control}
            render={({ field }) => <Input {...field} placeholder='Premium Cotton Shirt' />}
          />
        </Form.Item>

        <div className='grid grid-cols-2 gap-4'>
          <Form.Item
            label='Price ($)'
            validateStatus={errors.price ? "error" : ""}
            help={errors.price?.message}
          >
            <Controller
              name='price'
              control={control}
              render={({ field }) => (
                <InputNumber {...field} style={{ width: "100%" }} min={0} step={0.01} />
              )}
            />
          </Form.Item>

          <Form.Item
            label='Stock Quantity'
            validateStatus={errors.stock ? "error" : ""}
            help={errors.stock?.message}
          >
            <Controller
              name='stock'
              control={control}
              render={({ field }) => (
                <InputNumber {...field} style={{ width: "100%" }} min={0} precision={0} />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item
          label='Category'
          validateStatus={errors.categoryId ? "error" : ""}
          help={errors.categoryId?.message}
        >
          <Controller
            name='categoryId'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder='Select a category'
                options={categories?.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item label='Description'>
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={4} placeholder='Detailed product description...' />
            )}
          />
        </Form.Item>

        <Form.Item label='Images (URLs)' help='Enter image URLs separated by new lines'>
          <Controller
            name='images'
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextArea
                value={value?.join("\n") || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const urls = e.target.value.split("\n").filter(Boolean);
                  onChange(urls);
                }}
                rows={3}
                placeholder='https://example.com/image1.jpg'
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
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
