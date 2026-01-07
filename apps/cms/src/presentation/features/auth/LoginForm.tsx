"use client";

interface LoginFormData {
  email: string;
  password: string;
}

import { Card } from "@/components/Card";
import {
  BUTTON_LABELS,
  FORM_PLACEHOLDERS,
  MESSAGES,
  PAGE_DESCRIPTIONS,
  PAGE_TITLES,
  VALIDATION_MESSAGES,
} from "@/shared/constants/form-messages.constant";
import { Button, Form, Input, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useLogin } from "../../hooks/useAuth";

const { Title, Text } = Typography;

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [form] = Form.useForm<LoginFormData>();

  const onFinish = async (values: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(values);
      message.success(MESSAGES.success.loginSuccessful);
      router.push("/");
    } catch (error: unknown) {
      message.error((error as Error).message || MESSAGES.error.loginFailed);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Title level={2}>{PAGE_TITLES.cmsAdmin}</Title>
          <Text type='secondary'>{PAGE_DESCRIPTIONS.cmsLogin}</Text>
        </div>

        <Form form={form} layout='vertical' onFinish={onFinish} size='large'>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: VALIDATION_MESSAGES.required.email },
              { type: "email", message: VALIDATION_MESSAGES.format.email },
            ]}
          >
            <Input placeholder={FORM_PLACEHOLDERS.emailAddress} type='email' />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              { required: true, message: VALIDATION_MESSAGES.required.password },
              { min: 6, message: VALIDATION_MESSAGES.length.passwordMin },
            ]}
          >
            <Input.Password placeholder={FORM_PLACEHOLDERS.password} />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loginMutation.isPending}>
              {BUTTON_LABELS.signIn}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
