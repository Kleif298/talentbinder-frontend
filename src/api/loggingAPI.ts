const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface AuditLog {
  auditId: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: number | null;
  details: Record<string, any> | null;
  createdAt: string;
  userName?: string;
}

export interface LoggingFilters {
  action?: string;
  entityType?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface LoggingStats {
  action: string;
  count: number;
}

const loggingAPI = {
  getAll: async (filters: LoggingFilters = {}): Promise<{ logs: AuditLog[]; total: number; page: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters.action) params.append("action", filters.action);
    if (filters.entityType) params.append("entityType", filters.entityType);
    if (filters.userId) params.append("userId", filters.userId.toString());
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(`${API_URL}/api/logging?${params.toString()}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch logs");
    return response.json();
  },

  getByUser: async (userId: number, page: number = 1, limit: number = 50): Promise<{ logs: AuditLog[]; total: number; page: number; totalPages: number }> => {
    const response = await fetch(`${API_URL}/api/logging/user/${userId}?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user logs");
    return response.json();
  },

  getByEntity: async (entityType: string, entityId: number, page: number = 1, limit: number = 50): Promise<{ logs: AuditLog[]; total: number; page: number; totalPages: number }> => {
    const response = await fetch(`${API_URL}/api/logging/entity/${entityType}/${entityId}?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch entity logs");
    return response.json();
  },

  getStats: async (): Promise<LoggingStats[]> => {
    const response = await fetch(`${API_URL}/api/logging/stats`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    const data = await response.json();
    return data.stats;
  },
};

export default loggingAPI;
