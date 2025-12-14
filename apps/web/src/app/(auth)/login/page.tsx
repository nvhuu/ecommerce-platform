"use client";

import api from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", data);
      const { access_token, user } = response.data;

      // If the API doesn't return the user object on login (standard JWT flow often doesn't),
      // we might need to decode the token or fetch the profile.
      // For now, assuming the API returns what we need or we decode it.
      // Based on AuthController: return this.authService.login(user); which returns { access_token }.
      // We might need to fetch profile separately or adjust API.
      // For this step, I'll assume we might need to fetch profile or mock it if missing.

      login(access_token, user || { email: data.email, id: "temp-id" }); // Fallback for immediate UI update
      router.push("/");
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
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your email and password to sign in to your account</CardDescription>
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
          <Button className='w-full' type='submit' disabled={isLoading}>
            {isLoading && <LoadingOutlined className='mr-2 h-4 w-4 animate-spin' />}
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
