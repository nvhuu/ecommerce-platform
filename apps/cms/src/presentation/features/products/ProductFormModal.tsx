"use client";

import type { Product } from "@/domain/entities/product.entity";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "../../hooks/useProducts";

const { TextArea } = Input;

interface ProductFormModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
}

export function ProductFormModal({ open, product, onClose }: ProductFormModalProps) {
  const [form] = Form.useForm<ProductFormValues>();
  const { data: categories } = useCategories({ limit: 100 });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  useEffect(() => {
    if (open) {
      if (product) {
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
          images: product.images,
        });
      } else {
        form.resetFields();
      }
    }
  }, [product, open, form]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (product) {
        await updateMutation.mutateAsync({ id: product.id, data: values });
        message.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Product created successfully");
      }
      onClose();
    } catch (error: unknown) {
      message.error((error as Error).message || "Operation failed");
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
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        initialValues={{
          name: "",
          description: "",
          price: 0,
          stock: 0,
          categoryId: "",
          images: [],
        }}
      >
        <Form.Item
          label='Product Name'
          name='name'
          rules={[
            { required: true, message: "Please enter product name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder='Premium Cotton Shirt' />
        </Form.Item>

        <div className='grid grid-cols-2 gap-4'>
          <Form.Item
            label='Price ($)'
            name='price'
            rules={[
              { required: true, message: "Please enter price" },
              { type: "number", min: 0, message: "Price must be non-negative" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            label='Stock Quantity'
            name='stock'
            rules={[
              { required: true, message: "Please enter stock quantity" },
              { type: "number", min: 0, message: "Stock must be non-negative" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} precision={0} />
          </Form.Item>
        </div>

        <Form.Item
          label='Category'
          name='categoryId'
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder='Select a category'
            options={categories?.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        </Form.Item>

        <Form.Item label='Description' name='description'>
          <TextArea rows={4} placeholder='Detailed product description...' />
        </Form.Item>

        <Form.Item
          label='Images (URLs)'
          name='images'
          help='Enter image URLs separated by new lines'
          getValueFromEvent={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            return e.target.value.split("\n").filter(Boolean);
          }}
          getValueProps={(value: string[]) => ({
            value: value?.join("\n") || "",
          })}
        >
          <TextArea rows={3} placeholder='https://example.com/image1.jpg' />
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
      </Form>
    </Modal>
  );
}
