import { api } from './axios';

export interface Notification {
  id: string;
  tenantId: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  module: string;
  isRead: boolean;
  referenceId?: string | null;
  referenceType?: string | null;
  actionUrl?: string | null;
  createdAt: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
  module?: string;
  type?: string;
  isRead?: boolean;
}): Promise<PaginatedNotifications> => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await api.get('/notifications/unread/count');
  return response.data;
};

export const markAsRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
