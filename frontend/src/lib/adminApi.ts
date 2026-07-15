import apiClient from './apiClient';

export interface Order {
  id: string;
  customer_id: string;
  product_id: string;
  product_name: string;
  price: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  created_at: string;
  player_id?: string; 
  customer_name?: string;
}

export interface AdminStats {
  totalSales: string;
  pendingOrders: number;
  activeUsers: number;
  walletDeposits: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  receipt_url?: string;
  created_at: string;
  user_name?: string;
}

/**
 * جلب إحصائيات لوحة التحكم الشاملة من الـ Backend
 */
export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get('/analytics/overview');
  return response.data;
};

/**
 * جلب جميع الطلبات مع إمكانية التصفية حسب الحالة
 */
export const fetchOrders = async (status?: string): Promise<Order[]> => {
  const response = await apiClient.get('/orders', {
    params: status ? { status } : {},
  });
  return response.data;
};

/**
 * تحديث حالة طلب الشحن (قبول / رفض شحن الشدات والمنتجات)
 */
export const updateOrderStatus = async (
  orderId: string,
  status: 'Completed' | 'Rejected',
  notes?: string
): Promise<Order> => {
  const response = await apiClient.patch(`/orders/${orderId}/status`, {
    status,
    notes,
  });
  return response.data;
};

/**
 * جلب طلبات شحن المحفظة المعلقة التي تحتاج مراجعة يدوية
 */
export const fetchPendingWalletTransactions = async (): Promise<WalletTransaction[]> => {
  const response = await apiClient.get('/wallets/transactions/pending');
  return response.data;
};

/**
 * الموافقة على شحن محفظة العميل بعد التحقق من إيصال التحويل
 */
export const approveWalletTransaction = async (
  transactionId: string
): Promise<{ success: boolean; balance: number }> => {
  const response = await apiClient.post(`/wallets/transactions/${transactionId}/approve`);
  return response.data;
};

/**
 * رفض معاملة شحن المحفظة مع تحديد السبب
 */
export const rejectWalletTransaction = async (
  transactionId: string,
  reason: string
): Promise<{ success: boolean }> => {
  const response = await apiClient.post(`/wallets/transactions/${transactionId}/reject`, {
    reason,
  });
  return response.data;
};
