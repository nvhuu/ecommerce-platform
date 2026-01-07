"use client";

import { Card } from "@/components/Card";
import type { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/domain/entities/order.entity";
import { useDeleteOrder, useOrders, useUpdateOrderStatus } from "@/presentation/hooks/useOrders";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Select, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

export default function OrdersPage() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();

  const { data, isLoading } = useOrders({
    search: searchText,
    status: statusFilter,
    limit: 100,
  });

  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, data: { status } });
      message.success("Order status updated successfully");
    } catch (error: any) {
      message.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          message.success("Order deleted successfully");
        } catch (error: any) {
          message.error(error.message || "Failed to delete order");
        }
      },
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "orange",
      PROCESSING: "blue",
      COMPLETED: "green",
      CANCELLED: "red",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span className='font-mono text-sm'>#{id.slice(0, 8)}</span>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (record: Order) => (
        <div>
          <div className='font-medium'>{record.user?.name || "N/A"}</div>
          <div className='text-xs text-gray-500'>{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <span className='font-semibold text-green-600'>${amount.toFixed(2)}</span>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: OrderStatus, record: Order) => (
        <Select
          value={status}
          onChange={(value: OrderStatus) => handleStatusChange(record.id, value)}
          style={{ width: 130 }}
          loading={updateStatusMutation.isPending}
          options={Object.values(OrderStatus).map((s) => ({
            label: <Tag color={getStatusColor(s)}>{s}</Tag>,
            value: s,
          }))}
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Order) => (
        <Space>
          <Button size='small' onClick={() => window.alert("Order details: " + record.id)}>
            View
          </Button>
          <Button size='small' danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6 max-w-[1600px] mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Orders
          </Title>
          <p className='text-gray-500 mt-1'>Manage customer orders and track status</p>
        </div>
      </div>

      <Card>
        <div className='mb-4 flex gap-4'>
          <Input
            placeholder='Search orders...'
            prefix={<SearchOutlined />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            size='large'
            className='max-w-md'
          />
          <Select
            placeholder='Filter by status'
            allowClear
            onChange={setStatusFilter}
            style={{ width: 200 }}
            size='large'
            options={Object.values(OrderStatus).map((status) => ({
              label: status,
              value: status,
            }))}
          />
        </div>

        <Table
          columns={columns}
          dataSource={data || []}
          rowKey='id'
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
