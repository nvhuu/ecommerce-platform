import { apiClient } from "./api-client";

// Types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gatewayResponse?: any;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    orderNumber: string;
    customerName: string;
  };
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  PAYPAL = "PAYPAL",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export interface CreatePaymentDto {
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  gatewayResponse?: any;
}

export interface ProcessRefundDto {
  amount: number;
  reason: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// API Functions
export const paymentsApi = {
  // Get all payments with filters
  getPayments: async (filters?: PaymentFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.method) params.append("method", filters.method);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<Payment[]>(`/payments?${params.toString()}`);
    return response.data;
  },

  // Get payments by order
  getPaymentsByOrder: async (orderId: string) => {
    const response = await apiClient.get<Payment[]>(`/payments/order/${orderId}`);
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id: string) => {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  // Create payment
  createPayment: async (data: CreatePaymentDto) => {
    const response = await apiClient.post<Payment>("/payments", data);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id: string, status: PaymentStatus) => {
    const response = await apiClient.patch<Payment>(`/payments/${id}/status`, { status });
    return response.data;
  },

  // Process refund
  processRefund: async (id: string, data: ProcessRefundDto) => {
    const response = await apiClient.post<Payment>(`/payments/${id}/refund`, data);
    return response.data;
  },
};
