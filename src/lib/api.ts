const API_BASE = import.meta.env.VITE_API_BASE;

const apiRequest = async (method: string, url: string, data?: any) => {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response;
};

// Analytics API
export const analyticsApi = {
  getTeamAnalytics: async () => {
    const response = await apiRequest('GET', `${API_BASE}/analytics/team`);
    return response.json();
  },

  getCapacityPlanning: async () => {
    const response = await apiRequest('GET', `${API_BASE}/analytics/capacity`);
    return response.json();
  },
};

// Auth API
export const authApi = {
  login: async (data: { email: string; password: string }) => {
    const response = await apiRequest('POST', `${API_BASE}/users/login`, data);
    return response.json();
  },

  getProfile: async () => {
    const response = await apiRequest('GET', `${API_BASE}/users/me`);
    return response.json();
  },

  updateProfile: async (id: string, data: any) => {
    const response = await apiRequest('PUT', `${API_BASE}/users/${id}`, data);
    return response.json();
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    await apiRequest('POST', `${API_BASE}/users/change-password`, data);
  },
};

// Engineers API
export const engineersApi = {
  getAll: async (skill?: string) => {
    const url = skill ? `${API_BASE}/engineers?skill=${encodeURIComponent(skill)}` : `${API_BASE}/engineers`;
    const response = await apiRequest('GET', url);
    return response.json();
  },

  getByProject: async (projectId: string) => {
    const response = await apiRequest('GET', `${API_BASE}/engineers/by-project/${projectId}`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await apiRequest('GET', `${API_BASE}/engineers/${id}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await apiRequest('POST', `${API_BASE}/users`, data);
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await apiRequest('PUT', `${API_BASE}/users/${id}`, data);
    return response.json();
  },

  delete: async (id: string) => {
    await apiRequest('DELETE', `${API_BASE}/users/${id}`);
  },
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    const response = await apiRequest('GET', `${API_BASE}/projects`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await apiRequest('GET', `${API_BASE}/projects/${id}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await apiRequest('POST', `${API_BASE}/projects`, data);
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await apiRequest('PUT', `${API_BASE}/projects/${id}`, data);
    return response.json();
  },

  delete: async (id: string) => {
    await apiRequest('DELETE', `${API_BASE}/projects/${id}`);
  },
};

// Assignments API
export const assignmentsApi = {
  getAll: async () => {
    const response = await apiRequest('GET', `${API_BASE}/assignments`);
    return response.json();
  },

  getById: async (id: string) => {
    const response = await apiRequest('GET', `${API_BASE}/assignments/${id}`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await apiRequest('POST', `${API_BASE}/assignments`, data);
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await apiRequest('PUT', `${API_BASE}/assignments/${id}`, data);
    return response.json();
  },

  delete: async (id: string) => {
    await apiRequest('DELETE', `${API_BASE}/assignments/${id}`);
  },

  getByEngineer: async (engineerId: string) => {
    const response = await apiRequest('GET', `${API_BASE}/assignments/engineer/${engineerId}`);
    return response.json();
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const response = await apiRequest('GET', `${API_BASE}/dashboard`);
    return response.json();
  },
};
