"use client";

import { Card } from "@/components/Card";
import api from "@/lib/api";
import auth from "@/lib/auth"; // Assuming you have an auth helper
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Divider, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateProfileMutation = useMutation({
    mutationFn: (values: any) => {
      const user = auth.getUser();
      if (!user) throw new Error("No user found");
      return api.patch(`/users/${user.sub}`, values); // Assuming 'sub' is the user ID from JWT
    },
    onSuccess: () => {
      message.success("Profile updated successfully");
      form.resetFields(["password", "confirmPassword"]); // Clear password fields
    },
    onError: () => {
      message.error("Failed to update profile");
    },
  });

  const handleLogout = () => {
    auth.logout();
    router.push("/login");
  };

  const onFinish = (values: any) => {
    const { ...updateValues } = values;
    // Remove confirmPassword before sending
    delete updateValues.confirmPassword;
    if (!updateValues.password) delete updateValues.password;

    updateProfileMutation.mutate(updateValues);
  };

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Settings</h1>

      <Card title='Profile Settings' className='mb-6'>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item name='email' label='Email' tooltip='You cannot change your email directly.'>
            <Input disabled placeholder={auth.getUser()?.email} />
          </Form.Item>

          <Divider />

          <h3 className='text-lg font-medium mb-4'>Change Password</h3>
          <Form.Item
            name='password'
            label='New Password'
            rules={[{ min: 6, message: "Password must be at least 6 characters" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name='confirmPassword'
            label='Confirm New Password'
            dependencies={["password"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={updateProfileMutation.isPending}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title='Session'>
        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </div>
  );
}
