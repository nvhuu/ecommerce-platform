"use client";

import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Card as AntCard, Button, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";

// Workaround for Ant Design + React 19 type issue
const Card = AntCard as any;

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (values: any) => {
      // Example real API call:
      // return api.post("/auth/login", values);

      // Mock delay for simulation
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      message.success("Login successful!");
      router.push("/");
    },
    onError: (error) => {
      message.error("Login failed. Please check your credentials.");
      console.error(error);
    },
  });

  const onFinish = (values: any) => {
    loginMutation.mutate(values);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <Card className='w-full max-w-md shadow-lg rounded-xl border-none'>
        <div className='text-center mb-8'>
          <div className='mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4'>
            <LoginOutlined className='text-white text-2xl' />
          </div>
          <Title level={3} className='!m-0'>
            Welcome Back
          </Title>
          <Text type='secondary'>Sign in to your account to continue</Text>
        </div>

        <Form
          name='login_form'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout='vertical'
          size='large'
        >
          <Form.Item
            name='email'
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className='text-gray-400' />}
              placeholder='Email: admin@example.com'
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='w-full bg-blue-600 hover:bg-blue-500 border-none h-12 text-base font-medium'
              loading={loginMutation.isPending}
            >
              Sign In
            </Button>
          </Form.Item>

          <div className='text-center mt-4'>
            <Text type='secondary' className='text-sm'>
              Use <Text strong>admin@example.com</Text> / <Text strong>admin</Text>
            </Text>
          </div>
        </Form>
      </Card>

      <div className='absolute bottom-6 text-center text-gray-400 text-sm'>
        &copy; {new Date().getFullYear()} Ecommerce CMS. All rights reserved.
      </div>
    </div>
  );
}
