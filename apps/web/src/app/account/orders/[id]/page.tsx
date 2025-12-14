"use client";

import api from "@/lib/api";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Spin, Table, Tag, Typography } from "antd";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";

const { Title } = Typography;

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data.data as Order;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Spin size='large' />
      </div>
    );
  }

  if (!order) {
    return <div className='p-8 text-center'>Order not found</div>;
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (_: unknown, record: OrderItem) => <span>{record.productId}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>${Number(price).toFixed(2)}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_: unknown, record: OrderItem) => (
        <span>${(record.price * record.quantity).toFixed(2)}</span>
      ),
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <Button
        type='text'
        icon={<ArrowLeftOutlined style={{ fontSize: 16 }} />}
        onClick={() => router.back()}
        className='mb-4'
      >
        Back to Orders
      </Button>

      <div className='flex justify-between items-start mb-6'>
        <div>
          <Title level={2} className='mb-0'>
            Order #{order.id.slice(0, 8)}
          </Title>
          <span className='text-gray-500'>
            Placed on {format(new Date(order.createdAt), "PPP p")}
          </span>
        </div>
        <Tag
          color={order.status === "COMPLETED" ? "success" : "processing"}
          className='text-sm px-3 py-1'
        >
          {order.status}
        </Tag>
      </div>

      {/* @ts-expect-error -- antd Card type mismatch with React 19 */}
      <Card className='mb-8'>
        <Descriptions
          title='Order Info'
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label='Shipping Address'>{order.shippingAddress}</Descriptions.Item>
          <Descriptions.Item label='Payment Method'>{order.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label='Total Amount' span={2}>
            <span className='font-bold text-lg'>${Number(order.totalAmount).toFixed(2)}</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Title level={4}>Items</Title>
      <Table dataSource={order.items} columns={columns} rowKey='id' pagination={false} />
    </div>
  );
}
