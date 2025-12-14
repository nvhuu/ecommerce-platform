"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCart } from "@/providers/CartProvider";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  InputNumber,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

const { Title, Text } = Typography;

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  const columns: ColumnsType<any> = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <div className='w-16 h-16 bg-gray-100 rounded overflow-hidden'>
            {record.image ? (
              <img src={record.image} alt={text} className='w-full h-full object-cover' />
            ) : null}
          </div>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <Space>
          <Button
            size='small'
            icon={<MinusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity - 1)}
            disabled={record.quantity <= 1}
          />
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(val: any) => updateQuantity(record.id, val || 1)}
            style={{ width: 60, textAlign: "center" }}
            controls={false}
          />
          <Button
            size='small'
            icon={<PlusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity + 1)}
          />
        </Space>
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => <Text strong>${(record.price * record.quantity).toFixed(2)}</Text>,
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type='text'
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        />
      ),
    },
  ];

  if (cart.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type='secondary'>Your cart is currently empty.</Text>}
        >
          <Link href='/'>
            <Button type='primary' size='large' icon={<ShoppingCartOutlined />}>
              Start Shopping
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Title level={2} className='mb-8'>
        Shopping Cart
      </Title>

      <Row gutter={32}>
        <Col xs={24} lg={16}>
          <Table
            columns={columns}
            dataSource={cart}
            rowKey='id'
            pagination={false}
            className='mb-8 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100'
          />
          <Button danger onClick={clearCart}>
            Clear Cart
          </Button>
        </Col>

        <Col xs={24} lg={8}>
          {/* @ts-expect-error -- Antd Card type mismatch in current setup */}
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Order Summary
              </Title>
            }
            className='shadow-sm border-gray-100 sticky top-24'
          >
            <Space direction='vertical' className='w-full' size='large'>
              <div className='flex justify-between text-gray-500'>
                <Text>Subtotal</Text>
                <Text>${cartTotal.toFixed(2)}</Text>
              </div>
              <div className='flex justify-between text-gray-500'>
                <Text>Shipping</Text>
                <Text>Calculated at checkout</Text>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div className='flex justify-between items-center'>
                <Text strong style={{ fontSize: 18 }}>
                  Total
                </Text>
                <Text strong style={{ fontSize: 24 }} type='success'>
                  ${cartTotal.toFixed(2)}
                </Text>
              </div>

              <Button type='primary' size='large' block style={{ height: 48 }}>
                Proceed to Checkout
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
