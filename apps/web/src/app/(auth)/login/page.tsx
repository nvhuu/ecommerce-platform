"use client";

import type { LoginFormData } from "@/data/schemas/validation.schemas";
import { useLogin } from "@/presentation/hooks/useAuth";
import {
  BUTTON_LABELS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  LINK_TEXTS,
  MESSAGES,
  PAGE_DESCRIPTIONS,
  PAGE_TITLES,
  VALIDATION_MESSAGES,
} from "@/shared/constants/form-messages.constant";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [form] = Form.useForm<LoginFormData>();

  const onFinish = (values: LoginFormData) => {
    login(values, {
      onError: (error) => {
        message.error(error.message || MESSAGES.ERROR.LOGIN_FAILED);
      },
    });
  };

  return (
    <Card className='max-w-md mx-auto mt-20'>
      <div className='mb-6'>
        <Title level={3} className='mb-2'>
          {PAGE_TITLES.WELCOME_BACK}
        </Title>
        <Text type='secondary'>{PAGE_DESCRIPTIONS.LOGIN}</Text>
      </div>

      <Form form={form} layout='vertical' onFinish={onFinish} size='large'>
        <Form.Item
          label={FORM_LABELS.EMAIL}
          name='email'
          rules={[
            { required: true, message: VALIDATION_MESSAGES.REQUIRED.EMAIL },
            { type: "email", message: VALIDATION_MESSAGES.FORMAT.EMAIL },
          ]}
        >
          <Input type='email' placeholder={FORM_PLACEHOLDERS.EMAIL} />
        </Form.Item>

        <Form.Item
          label={
            <div className='flex items-center justify-between w-full'>
              <span>{FORM_LABELS.PASSWORD}</span>
              <Link
                href='/forgot-password'
                className='text-sm font-medium text-primary hover:underline'
              >
                {LINK_TEXTS.FORGOT_PASSWORD}
              </Link>
            </div>
          }
          name='password'
          rules={[
            { required: true, message: VALIDATION_MESSAGES.REQUIRED.PASSWORD },
            { min: 6, message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button
          type='primary'
          htmlType='submit'
          loading={isPending}
          icon={isPending ? <LoadingOutlined /> : null}
          block
          className='mt-4'
        >
          {BUTTON_LABELS.SIGN_IN}
        </Button>

        <div className='text-center mt-4 text-sm text-gray-600'>
          {LINK_TEXTS.NO_ACCOUNT}{" "}
          <Link href='/register' className='font-medium text-primary hover:underline'>
            {BUTTON_LABELS.SIGN_UP}
          </Link>
        </div>
      </Form>
    </Card>
  );
}
