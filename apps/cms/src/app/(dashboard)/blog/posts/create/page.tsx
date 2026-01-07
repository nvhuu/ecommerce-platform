"use client";

import { Card } from "@/components/Card";
import { BlogService, CreateBlogPostDto } from "@/domain/blog/blog.service";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  // TODO: Fetch categories from API when BlogCategory implementation is done on frontend
  const dummyCategories = [
    { label: "Technology", value: "507f1f77bcf86cd799439011" }, // Replace with real ID or select
  ];

  const mutation = useMutation({
    mutationFn: (data: CreateBlogPostDto) => BlogService.create(data),
    onSuccess: () => {
      message.success("Blog post created successfully");
      router.push("/blog/posts");
    },
    onError: () => {
      message.error("Failed to create blog post");
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate({
      ...values,
      categoryId: "675d0b45a3311ae50900e57f", // Hardcoded valid ID for now until categories are fetched or user created
      // In real app, we would have a category selector
    });
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='mb-6'>
        <Link href='/blog/posts' className='flex items-center text-gray-500 hover:text-black mb-2'>
          <ArrowLeftOutlined className='mr-2' /> Back to Posts
        </Link>
        <h1 className='text-2xl font-bold'>Create New Post</h1>
      </div>

      <Card>
        <Form form={form} layout='vertical' onFinish={onFinish} initialValues={{ status: "DRAFT" }}>
          <Form.Item
            name='title'
            label='Title'
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input size='large' placeholder='Enter post title' />
          </Form.Item>

          <Form.Item
            name='slug'
            label='Slug'
            rules={[{ required: true, message: "Please enter a slug" }]}
          >
            <Input placeholder='my-awesome-post' />
          </Form.Item>

          <Form.Item name='excerpt' label='Excerpt'>
            <Input.TextArea rows={3} placeholder='Short summary...' />
          </Form.Item>

          <Form.Item name='status' label='Status'>
            <Select
              options={[
                { label: "Draft", value: "DRAFT" },
                { label: "Published", value: "PUBLISHED" },
                { label: "Archived", value: "ARCHIVED" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name='content'
            label='Content'
            rules={[{ required: true, message: "Please enter content" }]}
          >
            <Input.TextArea rows={10} placeholder='HTML content here...' />
            {/* In a real app, use a Rich Text Editor like Quill or TinyMCE */}
          </Form.Item>

          {/* Hidden Category ID for now, or add Select when categories ready */}
          {/* 
            <Form.Item name="categoryId" label="Category">
                <Select options={dummyCategories} />
            </Form.Item> 
            */}

          <Form.Item className='mb-0 text-right'>
            <Button type='default' className='mr-2' onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={mutation.isPending}>
              Create Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
