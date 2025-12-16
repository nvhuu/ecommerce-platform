"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Form, Input, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/data/schemas/validation.schemas";
import { useLogin } from "../hooks/useAuth";

const { Title, Text } = Typography;

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      message.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      message.error(error.message || "Login failed");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Title level={2}>CMS Admin</Title>
          <Text type='secondary'>Sign in to your account</Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input {...field} size='large' placeholder='Email address' type='email' />
              )}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Input.Password {...field} size='large' placeholder='Password' />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              block
              loading={loginMutation.isPending}
            >
              Sign in
            </Button>
          </Form.Item>
        </form>
      </Card>
    </div>
  );
}
