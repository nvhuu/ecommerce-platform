"use client";

import api from "@/lib/api";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import { useState } from "react";

export default function CategoriesPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories", searchText],
    queryFn: async () => {
      const res = await api.get("/categories", {
        params: { search: searchText, limit: 100 },
      });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => api.post("/categories", values),
    onSuccess: () => {
      message.success("Category created successfully");
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: any) => api.patch(`/categories/${editingCategory.id}`, values),
    onSuccess: () => {
      message.success("Category updated successfully");
      setIsModalOpen(false);
      setEditingCategory(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      message.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error("Failed to delete category");
    },
  });

  const handleEdit = (record: any) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const onFinish = (values: any) => {
    if (editingCategory) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6'>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Categories</h1>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <div className='mb-4'>
        <Input
          placeholder='Search categories'
          prefix={<SearchOutlined />}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table dataSource={data?.data || []} columns={columns} rowKey='id' loading={isLoading} />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout='vertical'>
          <Form.Item
            name='name'
            label='Name'
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='slug'
            label='Slug'
            rules={[{ required: true, message: "Please enter slug" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Description'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className='w-full'>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
