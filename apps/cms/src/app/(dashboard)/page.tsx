"use client";

import { Card } from "@/components/Card";
import type { Order } from "@/domain/entities/order.entity";
import { useDashboardStats } from "@/presentation/hooks/useDashboard";
import { useOrders } from "@/presentation/hooks/useOrders";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Row, Skeleton, Statistic, Table, Tag } from "antd";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ page: 1, limit: 5 });

  const recentOrders = ordersData || [];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a className='text-blue-600 font-medium'>#{text.slice(0, 8)}</a>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (record: Order) => record.user?.name || record.user?.email || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let color = "geekblue";
        if (status === "COMPLETED") color = "green";
        if (status === "CANCELLED") color = "volcano";
        if (status === "PENDING") color = "orange";
        if (status === "PROCESSING") color = "blue";
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
    },
  ];

  if (statsLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h1>
        <p className='text-gray-500'>Welcome back! Here's what's happening today.</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='Total Sales'
              value={stats?.totalSales || 0}
              precision={2}
              styles={{ value: { color: "#3f8600" } }}
              prefix={<DollarOutlined />}
            />
            <div className='mt-2 text-xs text-gray-500'>
              {stats && stats.salesGrowth >= 0 ? (
                <>
                  <ArrowUpOutlined className='text-green-500' />{" "}
                  <span className='text-green-500 font-medium'>{stats.salesGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownOutlined className='text-red-500' />{" "}
                  <span className='text-red-500 font-medium'>
                    {Math.abs(stats?.salesGrowth || 0)}%
                  </span>
                </>
              )}{" "}
              vs last month
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='Total Orders'
              value={stats?.totalOrders || 0}
              styles={{ value: { color: "#1677ff" } }}
              prefix={<ShoppingCartOutlined />}
            />
            <div className='mt-2 text-xs text-gray-500'>
              {stats && stats.ordersGrowth >= 0 ? (
                <>
                  <ArrowUpOutlined className='text-green-500' />{" "}
                  <span className='text-green-500 font-medium'>{stats.ordersGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownOutlined className='text-red-500' />{" "}
                  <span className='text-red-500 font-medium'>
                    {Math.abs(stats?.ordersGrowth || 0)}%
                  </span>
                </>
              )}{" "}
              vs last month
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='New Customers'
              value={stats?.newCustomers || 0}
              styles={{ value: { color: "#cf1322" } }}
              prefix={<UserOutlined />}
            />
            <div className='mt-2 text-xs text-gray-500'>
              {stats && stats.customersGrowth >= 0 ? (
                <>
                  <ArrowUpOutlined className='text-green-500' />{" "}
                  <span className='text-green-500 font-medium'>{stats.customersGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownOutlined className='text-red-500' />{" "}
                  <span className='text-red-500 font-medium'>
                    {Math.abs(stats?.customersGrowth || 0)}%
                  </span>
                </>
              )}{" "}
              vs last month
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className='shadow-sm hover:shadow-md transition-shadow'>
            <Statistic
              title='Active Sessions'
              value={stats?.activeSessions || 0}
              valueStyle={{ color: "#faad14" }}
            />
            <div className='mt-2 text-xs text-gray-500'>Ongoing user activity</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className='mt-6'>
        <Col span={24}>
          <Card title='Recent Orders' className='shadow-sm'>
            <Table
              columns={columns}
              dataSource={recentOrders}
              rowKey='id'
              loading={ordersLoading}
              pagination={false}
              size='middle'
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
