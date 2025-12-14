"use client";

import { LoadingOutlined } from "@ant-design/icons";
// @ts-expect-error -- module resolution issue with @hookform/resolvers
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// @ts-expect-error -- module resolution issue
import { useForm } from "react-hook-form";
import * as z from "zod";
/* eslint-disable @typescript-eslint/no-explicit-any */

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
import api from "@/lib/api";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // API call to register
      // Endpoint typically /auth/register
      await api.post("/auth/register", {
        email: data.email,
        password: data.password,
      });

      // Redirect to login or auto-login
      // For now, redirect to login with a message? Or just login.
      // Let's redirect to login for simplicity as the API might not return token on register
      router.push("/login");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        setError((err as any).response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          {error && <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>{error}</div>}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' placeholder='m@example.com' {...register("email")} />
            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' {...register("password")} />
            {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input id='confirmPassword' type='password' {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4'>
          <Button className='w-full' type='submit' disabled={isLoading}>
            {isLoading && <LoadingOutlined className='mr-2 h-4 w-4 animate-spin' />}
            Create account
          </Button>
          <div className='text-center text-sm text-muted-foreground'>
            Already have an account?{" "}
            <Link href='/login' className='font-medium text-primary hover:underline'>
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
