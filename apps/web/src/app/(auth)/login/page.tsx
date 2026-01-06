"use client";

import { loginSchema, type LoginFormData } from "@/data/schemas/validation.schemas";
import { useLogin } from "@/presentation/hooks/useAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Form, Input, Typography } from "antd";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error) => {
        setError("root", {
          message: error.message || "Login failed",
        });
      },
    });
  };

  return (
    <Card className='max-w-md mx-auto mt-20'>
      <div className='mb-6'>
        <Title level={3} className='mb-2'>
          Welcome back
        </Title>
        <Text type='secondary'>Enter your email and password to sign in to your account</Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className='p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md'>
            {errors.root.message}
          </div>
        )}

        <Form.Item
          label='Email'
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input {...field} type='email' placeholder='m@example.com' size='large' />
            )}
          />
        </Form.Item>

        <Form.Item
          label={
            <div className='flex items-center justify-between w-full'>
              <span>Password</span>
              <Link
                href='/forgot-password'
                className='text-sm font-medium text-primary hover:underline'
              >
                Forgot password?
              </Link>
            </div>
          }
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name='password'
            control={control}
            render={({ field }) => <Input.Password {...field} size='large' />}
          />
        </Form.Item>

        <Button
          type='primary'
          htmlType='submit'
          loading={isPending}
          icon={isPending ? <LoadingOutlined /> : null}
          block
          size='large'
          className='mt-4'
        >
          Sign In
        </Button>

        <div className='text-center mt-4 text-sm text-gray-600'>
          Don&apos;t have an account?{" "}
          <Link href='/register' className='font-medium text-primary hover:underline'>
            Sign up
          </Link>
        </div>
      </form>
    </Card>
  );
}
