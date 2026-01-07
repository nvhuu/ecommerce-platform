"use client";

import type { User } from "@/domain/entities/user.entity";
import { UserRole } from "@/domain/entities/user.entity";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useCreateUser, useUpdateUser } from "../../hooks/useUsers";

interface UserFormModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export function UserFormModal({ open, user, onClose }: UserFormModalProps) {
  const [form] = Form.useForm<UserFormValues>();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (open) {
      if (user) {
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
        });
      } else {
        form.resetFields();
      }
    }
  }, [user, open, form]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (user) {
        await updateMutation.mutateAsync({
          id: user.id,
          data: {
            name: values.name,
            email: values.email,
            role: values.role,
          },
        });
        message.success("User updated successfully");
      } else {
        if (!values.password) {
          message.error("Password is required for new users");
          return;
        }
        await createMutation.mutateAsync({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        });
        message.success("User created successfully");
      }
      onClose();
    } catch (error: unknown) {
      message.error((error as Error).message || "Operation failed");
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
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        initialValues={{
          name: "",
          email: "",
          password: "",
          role: UserRole.USER,
        }}
      >
        <Form.Item
          label='Name'
          name='name'
          rules={[
            { required: true, message: "Please enter user name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder='John Doe' />
        </Form.Item>

        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input type='email' placeholder='john@example.com' />
        </Form.Item>

        {!user && (
          <Form.Item
            label='Password'
            name='password'
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder='Minimum 6 characters' />
          </Form.Item>
        )}

        <Form.Item
          label='Role'
          name='role'
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            placeholder='Select role'
            options={Object.values(UserRole).map((role) => ({
              label: role,
              value: role,
            }))}
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
      </Form>
    </Modal>
  );
}
