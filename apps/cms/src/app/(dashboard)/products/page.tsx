"use client";

import api from "@/lib/api";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import Image from "next/image";
import { useState } from "react";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

import { ElementType } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ProductCard = Card as ElementType;

// Define interfaces based on DTOs
// In a real app we'd share types or generate client
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();

  // Fetch Products
  const { data, isLoading } = useQuery({
    queryKey: ["products", searchText],
    queryFn: async () => {
      const params: any = { limit: 100 }; // Simple pagination for now
      if (searchText) params.search = searchText;
      const res = await api.get("/products", { params });
      // Identify if response is standard or paginated
      return res.data.data || res.data;
    },
  });

  // Fetch Categories for dropdown
  const { data: categories } = useQuery({
    queryKey: ["categories-list"],
    queryFn: async () => {
      const res = await api.get("/categories", { params: { limit: 100 } });
      return (res.data.data || res.data) as Category[];
    },
  });

  // Create/Update Mutation
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      // Ensure specific types for numbers
      const payload = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        // Simple array split for images if entered as comma-separated string, or keep as is if UI handled it
        // For simplicity, let's assume one image URL or split by newlines
        images: Array.isArray(values.images)
          ? values.images
          : (values.images || "").split("\n").filter(Boolean),
      };

      if (editingId) {
        return api.patch(`/products/${editingId}`, payload);
      }
      return api.post("/products", payload);
    },
    onSuccess: () => {
      message.success(`Product ${editingId ? "updated" : "created"} successfully`);
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || "Operation failed");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      message.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleEdit = (record: Product) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      // Convert array to string for simple textarea editing if desired
      images: record.images?.join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images: string[]) =>
        images && images[0] ? (
          <div className='w-12 h-12 relative overflow-hidden rounded border bg-gray-100'>
            <Image src={images[0]} alt='Product' fill className='object-cover' sizes='48px' />
          </div>
        ) : (
          <div className='w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500'>
            No Img
          </div>
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className='font-medium'>{text}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${Number(price).toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: Category) => <Tag>{cat?.name || "N/A"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space>
          <Button size='small' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button size='small' danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6 max-w-[1600px] mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Products
          </Title>
          <p className='text-gray-500 mt-1'>Manage your store inventory</p>
        </div>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          size='large'
        >
          Add Product
        </Button>
      </div>

      <ProductCard>
        <div className='mb-4'>
          <Input
            placeholder='Search products...'
            prefix={<SearchOutlined />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            size='large'
            className='max-w-md'
          />
        </div>

        <Table
          columns={columns}
          dataSource={Array.isArray(data) ? data : []}
          rowKey='id'
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </ProductCard>

      <Modal
        title={editingId ? "Edit Product" : "Create Product"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={(values: any) => mutation.mutate(values)}
          className='mt-4'
        >
          <Form.Item
            name='name'
            label='Product Name'
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder='Premium Cotton Shirt' />
          </Form.Item>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              name='price'
              label='Price ($)'
              rules={[{ required: true, message: "Price is required" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
            </Form.Item>

            <Form.Item
              name='stock'
              label='Stock Quantity'
              rules={[{ required: true, message: "Stock is required" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} precision={0} />
            </Form.Item>
          </div>

          <Form.Item
            name='categoryId'
            label='Category'
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Select
              placeholder='Select a category'
              options={categories?.map((c: Category) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </Form.Item>

          <Form.Item name='description' label='Description'>
            <TextArea rows={4} placeholder='Detailed product description...' />
          </Form.Item>

          <Form.Item
            name='images'
            label='Images (URL)'
            extra='Enter image URLs separated by new lines'
          >
            <TextArea rows={3} placeholder='https://example.com/image1.jpg' />
          </Form.Item>

          <div className='flex justify-end gap-2 mt-6'>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={mutation.isPending}>
              {editingId ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
