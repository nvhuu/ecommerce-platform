"use client";

import { Card } from "@/components/Card";
import { BlogService, CreateBlogPostDto } from "@/domain/blog/blog.service";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Select, Skeleton } from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form] = Form.useForm();

  // TODO: Fetch categories
  const dummyCategories = [{ label: "Technology", value: "507f1f77bcf86cd799439011" }];

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: () => BlogService.findOne(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<CreateBlogPostDto>) => BlogService.update(id, data),
    onSuccess: () => {
      message.success("Blog post updated successfully");
      router.push("/blog/posts");
    },
    onError: () => {
      message.error("Failed to update blog post");
    },
  });

  useEffect(() => {
    if (post) {
      form.setFieldsValue({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        status: post.status,
        content: post.content,
        // categoryId: post.categoryId, // ensure this matches select options
      });
    }
  }, [post, form]);

  const onFinish = (values: any) => {
    mutation.mutate({
      ...values,
      // categoryId: values.categoryId,
    });
  };

  if (isLoading) {
    return (
      <div className='p-6 max-w-4xl mx-auto'>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='mb-6'>
        <Link href='/blog/posts' className='flex items-center text-gray-500 hover:text-black mb-2'>
          <ArrowLeftOutlined className='mr-2' /> Back to Posts
        </Link>
        <h1 className='text-2xl font-bold'>Edit Post</h1>
      </div>

      <Card>
        <Form form={form} layout='vertical' onFinish={onFinish}>
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
          </Form.Item>

          <Form.Item className='mb-0 text-right'>
            <Button type='default' className='mr-2' onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={mutation.isPending}>
              Update Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
