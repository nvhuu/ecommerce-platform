import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Button, Form, Input, Rate } from "antd";
import { useState } from "react";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: { rating: number; comment: string }) => {
      const res = await api.post("/reviews", {
        productId,
        ...values,
      });
      return res.data;
    },
    onSuccess: () => {
      message.success("Review submitted successfully");
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setSubmitting(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to submit review";
      message.error(msg);
      setSubmitting(false);
    },
  });

  const onFinish = (values: any) => {
    setSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <div className='bg-gray-50 p-6 rounded-xl mt-8'>
      <h3 className='text-lg font-bold mb-4'>Write a Review</h3>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Form.Item
          name='rating'
          label='Rating'
          rules={[{ required: true, message: "Please give a rating" }]}
        >
          <Rate allowHalf />
        </Form.Item>
        <Form.Item
          name='comment'
          label='Comment'
          rules={[{ required: true, message: "Please write a comment" }]}
        >
          <Input.TextArea rows={4} placeholder='Share your thoughts about this product...' />
        </Form.Item>
        <Button loading={submitting} type='primary' htmlType='submit'>
          Submit Review
        </Button>
      </Form>
    </div>
  );
}
