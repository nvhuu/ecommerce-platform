"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Typography } from "antd";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const { Title } = Typography;

interface Order {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
}

export default function OrdersPage() {
  const router = useRouter();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await api.get("/orders/mine");
      return res.data.data;
    },
  });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span className='text-xs text-gray-500'>{id}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => format(new Date(date), "MMM dd, yyyy"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "COMPLETED" || status === "SHIPPED") color = "success";
        if (status === "PENDING") color = "processing";
        if (status === "CANCELLED") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => <span>${Number(amount).toFixed(2)}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Order) => (
        <a onClick={() => router.push(`/account/orders/${record.id}`)}>View</a>
      ),
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <Title level={2}>My Orders</Title>
      <Table
        dataSource={orders?.data || []}
        columns={columns}
        rowKey='id'
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
