"use client";

import { useCart } from "@/providers/CartProvider";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Empty, List, Space, Statistic, Typography } from "antd";

const { Text, Title } = Typography;

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const footer = (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <Title level={4} style={{ margin: 0 }}>
          Total
        </Title>
        <Statistic
          value={cartTotal}
          prefix='$'
          precision={2}
          valueStyle={{ fontSize: 20, fontWeight: "bold" }}
        />
      </div>
      <Button
        type='primary'
        size='large'
        block
        disabled={cart.length === 0}
        style={{ height: 48, fontSize: 16 }}
      >
        Checkout
      </Button>
    </div>
  );

  return (
    <Drawer
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
        </Space>
      }
      placement='right'
      onClose={() => setIsCartOpen(false)}
      open={isCartOpen}
      size='large'
      footer={cart.length > 0 ? footer : null}
    >
      {cart.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='Your cart is empty'
          style={{ marginTop: 100 }}
        >
          <Button type='primary' onClick={() => setIsCartOpen(false)}>
            Continue Shopping
          </Button>
        </Empty>
      ) : (
        <List
          itemLayout='horizontal'
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key='delete'
                  type='text'
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item.id)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.image}
                    shape='square'
                    size={64}
                    icon={<ShoppingCartOutlined />}
                  />
                }
                title={<Text strong>{item.name}</Text>}
                description={
                  <Space direction='vertical' size={0}>
                    <Text type='secondary'>${item.price.toFixed(2)}</Text>
                    <Space style={{ marginTop: 8 }}>
                      <Button
                        size='small'
                        icon={<MinusOutlined />}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      />
                      <Text style={{ minWidth: 20, textAlign: "center", display: "inline-block" }}>
                        {item.quantity}
                      </Text>
                      <Button
                        size='small'
                        icon={<PlusOutlined />}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      />
                    </Space>
                  </Space>
                }
              />
              <div style={{ alignSelf: "center", fontWeight: "bold" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
}
