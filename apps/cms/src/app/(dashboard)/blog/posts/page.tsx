"use client";

import { BlogPost, BlogService } from "@/domain/blog/blog.service";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Space, Table, Tag, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BlogPostsPage() {
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => BlogService.findAll(),
  });

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      onOk: async () => {
        try {
          await BlogService.delete(id);
          message.success("Post deleted successfully");
          refetch();
        } catch (error) {
          message.error("Failed to delete post");
        }
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className='font-medium'>{text}</span>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      className: "text-gray-500",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "PUBLISHED" ? "green" : status === "DRAFT" ? "orange" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
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
      render: (_: any, record: BlogPost) => (
        <Space size='middle'>
          <Link href={`/blog/posts/${record.id}`}>
            <Button icon={<EditOutlined />} type='text' />
          </Link>
          <Button
            icon={<DeleteOutlined />}
            type='text'
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Blog Posts</h1>
        <Link href='/blog/posts/create'>
          <Button type='primary' icon={<PlusOutlined />}>
            New Post
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []} // Assuming backend returns { data: [], ... }
        loading={isLoading}
        rowKey='id'
      />
    </div>
  );
}
