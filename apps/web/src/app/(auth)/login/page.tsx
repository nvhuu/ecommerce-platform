"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormData } from "@/data/schemas/validation.schemas";
import { useLogin } from "@/presentation/hooks/useAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setApiError(null);
    login(data, {
      onError: (error) => {
        setApiError(error.message || "Login failed");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your email and password to sign in to your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {apiError && (
            <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>{apiError}</div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' placeholder='m@example.com' {...register("email")} />
            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Password</Label>
              <Link
                href='/forgot-password'
                className='text-sm font-medium text-primary hover:underline'
              >
                Forgot password?
              </Link>
            </div>
            <Input id='password' type='password' {...register("password")} />
            {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button className='w-full' type='submit' disabled={isPending}>
            {isPending && <LoadingOutlined className='mr-2 h-4 w-4 animate-spin' />}
            Sign In
          </Button>
          <div className='text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{" "}
            <Link href='/register' className='font-medium text-primary hover:underline'>
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
