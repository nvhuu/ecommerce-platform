"use client";

import api from "@/lib/api";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal, Select, Space, Table, message } from "antd";
import { useState } from "react";

export default function OrdersPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["orders", searchText],
    queryFn: async () => {
      const res = await api.get("/orders", {
        params: { search: searchText, limit: 100 },
      });
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      message.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      message.error("Failed to update status");
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Select
          defaultValue={status}
          onChange={(value: string) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
          options={[
            { label: "PENDING", value: "PENDING" },
            { label: "PROCESSING", value: "PROCESSING" },
            { label: "SHIPPED", value: "SHIPPED" },
            { label: "DELIVERED", value: "DELIVERED" },
            { label: "CANCELLED", value: "CANCELLED" },
          ]}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setIsDetailsOpen(true);
            }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Orders</h1>

      <div className='mb-4'>
        <Input
          placeholder='Search orders by ID'
          prefix={<SearchOutlined />}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table dataSource={data?.data || []} columns={columns} rowKey='id' loading={isLoading} />

      <Modal
        title='Order Details'
        open={isDetailsOpen}
        onCancel={() => setIsDetailsOpen(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.totalAmount}
            </p>

            <h3 className='text-lg font-bold mt-4'>Items</h3>
            <Table
              dataSource={selectedOrder.items}
              rowKey='id'
              pagination={false}
              columns={[
                { title: "Product ID", dataIndex: "productId" },
                { title: "Quantity", dataIndex: "quantity" },
                { title: "Price", dataIndex: "price", render: (p: number) => `$${p}` },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
