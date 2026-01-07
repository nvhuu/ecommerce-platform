"use client";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table, Tag, Typography } from "antd";
import { Card } from "@/components/Card";
import { useState } from "react";
import type { User } from "@/domain/entities/user.entity";
import { UserRole } from "@/domain/entities/user.entity";
import { UserFormModal } from "@/presentation/features/users/UserFormModal";
import { useDeleteUser, useUsers } from "@/presentation/hooks/useUsers";

const { Title } = Typography;

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading } = useUsers({ search: searchText, limit: 100 });
  const deleteMutation = useDeleteUser();

  const handleEdit = (record: User) => {
    setEditingUser(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("User deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete user");
        }
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      [UserRole.SUPERADMIN]: "red",
      [UserRole.ADMIN]: "blue",
      [UserRole.USER]: "green",
    };
    return colors[role] || "default";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className='font-medium'>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className='text-gray-600'>{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => <Tag color={getRoleColor(role)}>{role}</Tag>,
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
      render: (_: any, record: User) => (
        <Space>
          <Button size='small' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            size='small'
            danger
            onClick={() => handleDelete(record.id)}
            disabled={record.role === UserRole.SUPERADMIN}
          >
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
            Users
          </Title>
          <p className='text-gray-500 mt-1'>Manage system users and permissions</p>
        </div>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          size='large'
        >
          Add User
        </Button>
      </div>

      <Card>
        <div className='mb-4'>
          <Input
            placeholder='Search users...'
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

      <UserFormModal open={isModalOpen} user={editingUser} onClose={handleModalClose} />
    </div>
  );
}
