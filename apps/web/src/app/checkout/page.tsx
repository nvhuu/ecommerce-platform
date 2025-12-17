"use client";

import { PaymentForm } from "@/components/PaymentForm";
import type { CreateOrderDto } from "@/domain/entities/order.entity";
import api from "@/lib/api";
import { useCart } from "@/providers/CartProvider";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { App, Button, Card, Col, Form, Input, Row, Steps, Typography } from "antd";
import { type AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [form] = Form.useForm();
  const { message: antdMessage } = App.useApp();

  interface CheckoutFormValues {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    paymentMethod: string;
  }

  const checkoutMutation = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      // 1. Create Order
      const orderPayload: CreateOrderDto = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: values.fullName,
          phone: "", // Phone not collected in form, using empty string
          address: values.address,
          city: values.city,
          postalCode: values.zip,
          country: "US", // Default country
        },
        paymentMethod: values.paymentMethod || "CARD",
      };

      const orderRes = await api.post("/orders", orderPayload);
      const orderId = orderRes.data.data.id;

      // 2. Process Payment
      if (values.paymentMethod === "CARD") {
        await api.post("/payments/process", {
          orderId,
          amount: cartTotal,
          currency: "USD",
        });
      }

      return orderId;
    },
    onSuccess: () => {
      clearCart();
      antdMessage.success("Order placed successfully!");
      router.push("/checkout/success");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error("Checkout failed", error);
      const msg = error.response?.data?.message || "Checkout failed. Please try again.";
      antdMessage.error(msg);
    },
  });

  const onFinish = (values: CheckoutFormValues) => {
    checkoutMutation.mutate(values);
  };

  if (cart.length === 0) {
    return (
      <div className='container mx-auto px-4 py-20 text-center'>
        <Title level={2}>Your cart is empty</Title>
        <Text className='block mb-8'>Add some products to proceed to checkout.</Text>
        <Button size='large' type='primary' onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      <Title level={2} className='mb-8'>
        Checkout
      </Title>

      <Row gutter={48}>
        <Col xs={24} lg={14}>
          <Steps
            current={0}
            className='mb-8'
            items={[{ title: "Shipping" }, { title: "Payment" }, { title: "Confirmation" }]}
          />

          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            initialValues={{ paymentMethod: "CARD" }}
          >
            {/* Shipping Details */}
            {/* @ts-expect-error -- antd Card type mismatch */}
            <Card title='Shipping Details' className='mb-6'>
              <Form.Item
                name='fullName'
                label='Full Name'
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input size='large' placeholder='John Doe' />
              </Form.Item>

              <Form.Item
                name='email'
                label='Email'
                rules={[{ required: true, type: "email", message: "Please enter valid email" }]}
              >
                <Input size='large' placeholder='email@example.com' />
              </Form.Item>

              <Form.Item
                name='address'
                label='Address'
                rules={[{ required: true, message: "Please enter shipping address" }]}
              >
                <Input size='large' placeholder='123 Main St' />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='city'
                    label='City'
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input size='large' placeholder='New York' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='zip'
                    label='ZIP Code'
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input size='large' placeholder='10001' />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Payment Section */}
            <PaymentForm />

            <Button
              type='primary'
              htmlType='submit'
              size='large'
              block
              loading={checkoutMutation.isPending}
              className='mt-8 h-12 text-lg font-bold'
              icon={<ArrowRightOutlined />}
            >
              Place Order (${cartTotal.toFixed(2)})
            </Button>
          </Form>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={10}>
          {/* @ts-expect-error -- antd Card type mismatch */}
          <Card title='Order Summary' className='sticky top-24'>
            <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
              {cart.map((item) => (
                <div key={item.id} className='flex justify-between items-center'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative'>
                      {item.image ? (
                        <Image src={item.image} fill className='object-cover' alt={item.name} />
                      ) : null}
                    </div>
                    <div>
                      <p className='font-medium text-sm line-clamp-1'>{item.name}</p>
                      <p className='text-gray-500 text-xs'>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className='font-medium'>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className='border-t mt-6 pt-4 space-y-2'>
              <div className='flex justify-between text-gray-500'>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-gray-500'>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className='flex justify-between font-bold text-lg border-t pt-4 mt-2'>
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
