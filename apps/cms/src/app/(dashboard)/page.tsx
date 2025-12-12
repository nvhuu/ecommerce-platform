"use client";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card as AntCard, Col, Row, Statistic, Table, Tag } from "antd";

// Workaround for Ant Design + React 19 type issue
const Card = AntCard as any;

export default function DashboardPage() {
  // Mock data for recent orders
  const recentOrders = [
    {
      key: "1",
      orderId: "#ORD-001",
      customer: "John Doe",
      amount: "$120.00",
      status: "Completed",
    },
    {
      key: "2",
      orderId: "#ORD-002",
      customer: "Jane Smith",
      amount: "$85.50",
      status: "Processing",
    },
    {
      key: "3",
      orderId: "#ORD-003",
      customer: "Alice Johnson",
      amount: "$200.00",
      status: "Pending",
    },
    {
      key: "4",
      orderId: "#ORD-004",
      customer: "Bob Brown",
      amount: "$55.20",
      status: "Rejected",
    },
  ];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text: string) => <a className='text-blue-600 font-medium'>{text}</a>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let color = "geekblue";
        if (status === "Completed") color = "green";
        if (status === "Rejected") color = "volcano";
        if (status === "Pending") color = "orange";
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h1>
        <p className='text-gray-500'>Welcome back! Here's what's happening today.</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card variant='borderless' className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='Total Sales'
              value={112893}
              precision={2}
              styles={{ content: { color: "#3f8600" } }}
              prefix={<DollarOutlined />}
              suffix=''
            />
            <div className='mt-2 text-xs text-gray-500'>
              <ArrowUpOutlined className='text-green-500' />{" "}
              <span className='text-green-500 font-medium'>12%</span> vs last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant='borderless' className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='Total Orders'
              value={93}
              styles={{ content: { color: "#1677ff" } }}
              prefix={<ShoppingCartOutlined />}
            />
            <div className='mt-2 text-xs text-gray-500'>
              <ArrowUpOutlined className='text-green-500' />{" "}
              <span className='text-green-500 font-medium'>8%</span> vs last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant='borderless' className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='New Customers'
              value={15}
              styles={{ content: { color: "#cf1322" } }}
              prefix={<UserOutlined />}
            />
            <div className='mt-2 text-xs text-gray-500'>
              <ArrowDownOutlined className='text-red-500' />{" "}
              <span className='text-red-500 font-medium'>2%</span> vs last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant='borderless' className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='Active Sessions'
              value={248}
              styles={{ content: { color: "#faad14" } }}
            />
            <div className='mt-2 text-xs text-gray-500'>Ongoing user activity</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className='mt-6'>
        <Col span={24}>
          <Card title='Recent Orders' variant='borderless' className='shadow-sm'>
            <Table columns={columns} dataSource={recentOrders} pagination={false} size='middle' />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
