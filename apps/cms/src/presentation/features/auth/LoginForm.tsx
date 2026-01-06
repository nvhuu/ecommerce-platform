"use client";

import type { LoginFormData } from "@/data/schemas/validation.schemas";
import {
  BUTTON_LABELS,
  FORM_PLACEHOLDERS,
  MESSAGES,
  PAGE_DESCRIPTIONS,
  PAGE_TITLES,
  VALIDATION_MESSAGES,
} from "@/shared/constants/form-messages.constant";
import { Button, Card, Form, Input, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useAuth";

const { Title, Text } = Typography;

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [form] = Form.useForm<LoginFormData>();

  const onFinish = async (values: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(values);
      message.success(MESSAGES.SUCCESS.LOGIN);
      router.push("/");
    } catch (error: any) {
      message.error(error.message || MESSAGES.ERROR.LOGIN_FAILED);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <Title level={2}>{PAGE_TITLES.CMS_ADMIN}</Title>
          <Text type='secondary'>{PAGE_DESCRIPTIONS.CMS_LOGIN}</Text>
        </div>

        <Form form={form} layout='vertical' onFinish={onFinish} size='large'>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: VALIDATION_MESSAGES.REQUIRED.EMAIL },
              { type: "email", message: VALIDATION_MESSAGES.FORMAT.EMAIL },
            ]}
          >
            <Input placeholder={FORM_PLACEHOLDERS.EMAIL_ADDRESS} type='email' />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              { required: true, message: VALIDATION_MESSAGES.REQUIRED.PASSWORD },
              { min: 6, message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN },
            ]}
          >
            <Input.Password placeholder={FORM_PLACEHOLDERS.PASSWORD} />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loginMutation.isPending}>
              {BUTTON_LABELS.SIGN_IN}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
