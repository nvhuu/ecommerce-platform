"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Modal, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import type { Category } from "@/domain/entities/category.entity";
import { CategoryFormModal } from "@/presentation/features/categories/CategoryFormModal";
import { useCategories, useDeleteCategory } from "@/presentation/hooks/useCategories";

const { Title } = Typography;

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState("");

  const { data: categories, isLoading } = useCategories({ limit: 100 });
  const deleteMutation = useDeleteCategory();

  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone. Child categories will also be affected.",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("Category deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete category");
        }
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className='font-medium'>{text}</span>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => <Tag color='blue'>{text}</Tag>,
    },
    {
      title: "Parent Category",
      dataIndex: "parent",
      key: "parent",
      render: (parent: Category | null) =>
        parent?.name || <span className='text-gray-400'>None</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Category) => (
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
            Categories
          </Title>
          <p className='text-gray-500 mt-1'>Organize your products into categories</p>
        </div>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          size='large'
        >
          Add Category
        </Button>
      </div>

      <Card>
        <div className='mb-4'>
          <Input
            placeholder='Search categories...'
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            size='large'
            className='max-w-md'
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredCategories || []}
          rowKey='id'
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <CategoryFormModal open={isModalOpen} category={editingCategory} onClose={handleModalClose} />
    </div>
  );
}
