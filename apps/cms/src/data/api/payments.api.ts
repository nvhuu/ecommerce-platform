import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "./endpoints.constant";

// Types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gatewayResponse?: Record<string, unknown>;
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
  gatewayResponse?: Record<string, unknown>;
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

// API Functions - Using endpoint constants
export const paymentsApi = {
  // Get all payments with filters
  getPayments: async (filters?: PaymentFilters) => {
    return await apiClient.get<Payment[]>({
      path: API_ENDPOINTS.PAYMENTS.BASE,
      query: filters as Record<string, string | number | boolean | null | undefined>,
    });
  },

  // Get payments by order
  getPaymentsByOrder: async (orderId: string) => {
    return await apiClient.get<Payment[]>({
      path: API_ENDPOINTS.PAYMENTS.BY_ORDER,
      params: { orderId },
    });
  },

  // Get payment by ID
  getPaymentById: async (id: string) => {
    return await apiClient.get<Payment>({
      path: API_ENDPOINTS.PAYMENTS.BY_ID,
      params: { id },
    });
  },

  // Create payment
  createPayment: async (data: CreatePaymentDto) => {
    return await apiClient.post<Payment>(
      {
        path: API_ENDPOINTS.PAYMENTS.BASE,
      },
      data
    );
  },

  // Update payment status
  updatePaymentStatus: async (id: string, status: PaymentStatus) => {
    return await apiClient.patch<Payment>(
      {
        path: API_ENDPOINTS.PAYMENTS.UPDATE_STATUS,
        params: { id },
      },
      { status }
    );
  },

  // Process refund
  processRefund: async (id: string, data: ProcessRefundDto) => {
    return await apiClient.post<Payment>(
      {
        path: API_ENDPOINTS.PAYMENTS.REFUND,
        params: { id },
      },
      data
    );
  },
};
