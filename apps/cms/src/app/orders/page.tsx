"use client";

import api from "@/lib/api";
import { Order } from "@/types";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>("/orders");
      setOrders(response as any);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
      </div>

      <div className='bg-white rounded-lg border shadow-sm'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-6 py-3'>Order ID</th>
              <th className='px-6 py-3'>User ID</th>
              <th className='px-6 py-3'>Total Amount</th>
              <th className='px-6 py-3'>Status</th>
              <th className='px-6 py-3'>Created At</th>
              <th className='px-6 py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className='bg-white border-b hover:bg-gray-50'>
                <td className='px-6 py-4 font-medium text-gray-900'>{order.id.slice(0, 8)}...</td>
                <td className='px-6 py-4'>{order.userId.slice(0, 8)}...</td>
                <td className='px-6 py-4'>${order.totalAmount}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className='px-6 py-4'>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className='px-6 py-4'>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className='border rounded px-2 py-1 text-xs'
                  >
                    <option value='PENDING'>Pending</option>
                    <option value='COMPLETED'>Completed</option>
                    <option value='CANCELLED'>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className='px-6 py-4 text-center'>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
