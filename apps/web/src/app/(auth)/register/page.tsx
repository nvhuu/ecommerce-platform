"use client";

import type { RegisterFormData } from "@/data/schemas/validation.schemas";
import { useRegister } from "@/presentation/hooks/useAuth";
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

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();
  const [form] = Form.useForm<RegisterFormData>();

  const onFinish = (values: RegisterFormData) => {
    register(values, {
      onError: (error) => {
        message.error(error.message || MESSAGES.ERROR.REGISTER_FAILED);
      },
    });
  };

  return (
    <Card className='max-w-md mx-auto mt-20'>
      <div className='mb-6'>
        <Title level={3} className='mb-2'>
          {PAGE_TITLES.CREATE_ACCOUNT}
        </Title>
        <Text type='secondary'>{PAGE_DESCRIPTIONS.REGISTER}</Text>
      </div>

      <Form form={form} layout='vertical' onFinish={onFinish} size='large'>
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item
            label={FORM_LABELS.FIRST_NAME}
            name='firstName'
            rules={[
              { required: true, message: VALIDATION_MESSAGES.REQUIRED.FIRST_NAME },
              { min: 2, message: VALIDATION_MESSAGES.LENGTH.FIRST_NAME_MIN },
            ]}
          >
            <Input placeholder={FORM_PLACEHOLDERS.FIRST_NAME} />
          </Form.Item>

          <Form.Item
            label={FORM_LABELS.LAST_NAME}
            name='lastName'
            rules={[
              { required: true, message: VALIDATION_MESSAGES.REQUIRED.LAST_NAME },
              { min: 2, message: VALIDATION_MESSAGES.LENGTH.LAST_NAME_MIN },
            ]}
          >
            <Input placeholder={FORM_PLACEHOLDERS.LAST_NAME} />
          </Form.Item>
        </div>

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
          label={FORM_LABELS.PASSWORD}
          name='password'
          rules={[
            { required: true, message: VALIDATION_MESSAGES.REQUIRED.PASSWORD },
            { min: 6, message: VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={FORM_LABELS.CONFIRM_PASSWORD}
          name='confirmPassword'
          dependencies={["password"]}
          rules={[
            { required: true, message: VALIDATION_MESSAGES.REQUIRED.CONFIRM_PASSWORD },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(VALIDATION_MESSAGES.MATCH.PASSWORD));
              },
            }),
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
          {BUTTON_LABELS.CREATE_ACCOUNT}
        </Button>

        <div className='text-center mt-4 text-sm text-gray-600'>
          {LINK_TEXTS.HAVE_ACCOUNT}{" "}
          <Link href='/login' className='font-medium text-primary hover:underline'>
            {BUTTON_LABELS.SIGN_IN}
          </Link>
        </div>
      </Form>
    </Card>
  );
}
