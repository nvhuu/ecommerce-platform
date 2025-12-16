"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/data/schemas/validation.schemas";
import type { User } from "@/domain/entities/user.entity";
import { UserRole } from "@/domain/entities/user.entity";
import { useCreateUser, useUpdateUser } from "../../hooks/useUsers";

interface UserFormModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export function UserFormModal({ open, user, onClose }: UserFormModalProps) {
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: UserRole.USER,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    try {
      if (user) {
        await updateMutation.mutateAsync({
          id: user.id,
          data: data as UpdateUserFormData,
        });
        message.success("User updated successfully");
      } else {
        await createMutation.mutateAsync(data as CreateUserFormData);
        message.success("User created successfully");
      }
      onClose();
    } catch (error: any) {
      message.error(error.message || "Operation failed");
    }
  };

  return (
    <Modal
      title={user ? "Edit User" : "Create User"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
        <Form.Item
          label='Name'
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required
        >
          <Controller
            name='name'
            control={control}
            render={({ field }) => <Input {...field} placeholder='John Doe' />}
          />
        </Form.Item>

        <Form.Item
          label='Email'
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
          required
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => <Input {...field} type='email' placeholder='john@example.com' />}
          />
        </Form.Item>

        {!user && (
          <Form.Item
            label='Password'
            validateStatus={"password" in errors && errors.password ? "error" : ""}
            help={"password" in errors ? errors.password?.message : undefined}
            required
          >
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Input.Password {...field} placeholder='Minimum 6 characters' />
              )}
            />
          </Form.Item>
        )}

        <Form.Item
          label='Role'
          validateStatus={errors.role ? "error" : ""}
          help={errors.role?.message}
        >
          <Controller
            name='role'
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder='Select role'>
                {Object.values(UserRole).map((role) => (
                  <Select.Option key={role} value={role}>
                    {role}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        <div className='flex justify-end gap-2 mt-6'>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type='primary'
            htmlType='submit'
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
