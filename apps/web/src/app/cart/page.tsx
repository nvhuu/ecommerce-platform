"use client";

import type { CartItem } from "@/domain/entities/cart.entity";
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/presentation/hooks/useCart";
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
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: clearCart } = useClearCart();

  const cartItems = cart?.items || [];
  const cartTotal = cart?.total || 0;

  const columns: ColumnsType<CartItem> = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <Space>
          <div className='w-16 h-16 bg-gray-100 rounded overflow-hidden'>
            {product.imageUrls?.[0] && (
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            )}
          </div>
          <Text strong>{product.name}</Text>
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
            onClick={() =>
              updateQuantity({ itemId: record.id, dto: { quantity: record.quantity - 1 } })
            }
            disabled={record.quantity <= 1}
          />
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(val: number | null) =>
              updateQuantity({ itemId: record.id, dto: { quantity: val || 1 } })
            }
            style={{ width: 60, textAlign: "center" }}
            controls={false}
          />
          <Button
            size='small'
            icon={<PlusOutlined />}
            onClick={() =>
              updateQuantity({ itemId: record.id, dto: { quantity: record.quantity + 1 } })
            }
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
          onClick={() => removeItem(record.id)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <Text>Loading cart...</Text>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type='secondary'>Your cart is currently empty.</Text>}
        >
          <Link href='/products'>
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
            dataSource={cartItems}
            rowKey='id'
            pagination={false}
            className='mb-8 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100'
          />
          <Button danger onClick={() => clearCart()}>
            Clear Cart
          </Button>
        </Col>

        <Col xs={24} lg={8}>
          {/* @ts-expect-error - Ant Design Card type compatibility with React 19 */}
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

              <Button
                type='primary'
                size='large'
                block
                style={{ height: 48 }}
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
