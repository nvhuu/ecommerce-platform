"use client";

import { registerSchema, type RegisterFormData } from "@/data/schemas/validation.schemas";
import { useRegister } from "@/presentation/hooks/useAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Form, Input, Typography } from "antd";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data, {
      onError: (error) => {
        setError("root", {
          message: error.message || "Registration failed",
        });
      },
    });
  };

  return (
    <Card className='max-w-md mx-auto mt-20'>
      <div className='mb-6'>
        <Title level={3} className='mb-2'>
          Create an account
        </Title>
        <Text type='secondary'>Enter your information to create a new account</Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className='p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md'>
            {errors.root.message}
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <Form.Item
            label='First name'
            validateStatus={errors.firstName ? "error" : ""}
            help={errors.firstName?.message}
          >
            <Controller
              name='firstName'
              control={control}
              render={({ field }) => <Input {...field} placeholder='John' size='large' />}
            />
          </Form.Item>

          <Form.Item
            label='Last name'
            validateStatus={errors.lastName ? "error" : ""}
            help={errors.lastName?.message}
          >
            <Controller
              name='lastName'
              control={control}
              render={({ field }) => <Input {...field} placeholder='Doe' size='large' />}
            />
          </Form.Item>
        </div>

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
          label='Password'
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name='password'
            control={control}
            render={({ field }) => <Input.Password {...field} size='large' />}
          />
        </Form.Item>

        <Form.Item
          label='Confirm password'
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name='confirmPassword'
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
          Create account
        </Button>

        <div className='text-center mt-4 text-sm text-gray-600'>
          Already have an account?{" "}
          <Link href='/login' className='font-medium text-primary hover:underline'>
            Sign in
          </Link>
        </div>
      </form>
    </Card>
  );
}
