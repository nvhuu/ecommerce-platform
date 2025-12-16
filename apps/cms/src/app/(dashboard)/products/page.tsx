"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Modal, Space, Table, Tag, Typography } from "antd";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/domain/entities/product.entity";
import { ProductFormModal } from "@/presentation/features/products/ProductFormModal";
import { useDeleteProduct, useProducts } from "@/presentation/hooks/useProducts";

const { Title } = Typography;

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading } = useProducts({ search: searchText, limit: 100 });
  const deleteMutation = useDeleteProduct();

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("Product deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete product");
        }
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
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
      render: (cat: any) => <Tag>{cat?.name || "N/A"}</Tag>,
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
          onClick={() => setIsModalOpen(true)}
          size='large'
        >
          Add Product
        </Button>
      </div>

      <Card>
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
          dataSource={data?.data || []}
          rowKey='id'
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <ProductFormModal open={isModalOpen} product={editingProduct} onClose={handleModalClose} />
    </div>
  );
}
