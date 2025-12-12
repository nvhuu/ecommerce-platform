"use client";

import api from "@/lib/api";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select, Space, Table, Tag, message } from "antd";
import { useState } from "react";

export default function UsersPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await api.get("/users", {
        params: { search: searchText, limit: 100 },
      });
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: any) => api.patch(`/users/${editingUser.id}`, values),
    onSuccess: () => {
      message.success("User updated successfully");
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      message.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      message.error("Failed to delete user");
    },
  });

  const handleEdit = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue({ role: record.role });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const onFinish = (values: any) => {
    if (editingUser) {
      updateMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color={role === "ADMIN" ? "red" : "blue"}>{role}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
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
      <h1 className='text-2xl font-bold mb-4'>Users</h1>

      <div className='mb-4'>
        <Input
          placeholder='Search users by email'
          prefix={<SearchOutlined />}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table dataSource={data?.data || []} columns={columns} rowKey='id' loading={isLoading} />

      <Modal
        title='Edit User'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout='vertical'>
          <Form.Item name='role' label='Role' rules={[{ required: true }]}>
            <Select
              options={[
                { label: "USER", value: "USER" },
                { label: "ADMIN", value: "ADMIN" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className='w-full'>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
