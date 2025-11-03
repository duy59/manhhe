// API Utility để gọi backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Lấy token từ localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Lưu token vào localStorage
export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Xóa token khỏi localStorage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Lưu thông tin user
export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Lấy thông tin user
export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Hàm fetch với authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Sending request with token (first 20 chars):', token.substring(0, 20) + '...');
  } else {
    console.log('⚠️ No token found when making request to:', url);
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  // Nếu unauthorized, redirect về login
  if (response.status === 401) {
    console.log('❌ 401 Unauthorized - Token invalid or expired');
    console.log('🔑 Token that was rejected:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  }

  return response;
};

// API Methods
export const api = {
  // Auth
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetchWithAuth('/auth/logout', { method: 'POST' });
    removeToken();
    return response.json();
  },

  // Materials
  getMaterials: async () => {
    const response = await fetchWithAuth('/materials');
    return response.json();
  },

  getMaterialById: async (id) => {
    const response = await fetchWithAuth(`/materials/${id}`);
    return response.json();
  },

  searchMaterials: async (name) => {
    const response = await fetchWithAuth(`/materials/search?name=${name}`);
    return response.json();
  },

  getWarnings: async () => {
    const response = await fetchWithAuth('/materials/warning');
    return response.json();
  },

  // Transactions
  importMaterial: async (data) => {
    const response = await fetchWithAuth('/materials/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  exportMaterial: async (data) => {
    const response = await fetchWithAuth('/materials/export', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getTransactions: async (startDate, endDate) => {
    let url = '/transactions';
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetchWithAuth(url);
    return response.json();
  },

  getTransactionsByMaterial: async (materialId) => {
    const response = await fetchWithAuth(`/transactions/material/${materialId}`);
    return response.json();
  },

  // Material Requests
  getRequests: async () => {
    const response = await fetchWithAuth('/requests');
    return response.json();
  },

  getPendingRequests: async () => {
    const response = await fetchWithAuth('/requests/pending');
    return response.json();
  },

  createRequest: async (data) => {
    const response = await fetchWithAuth('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  approveRequest: async (id) => {
    const response = await fetchWithAuth(`/requests/${id}/approve`, {
      method: 'PUT',
    });
    return response.json();
  },

  rejectRequest: async (id, reason) => {
    const response = await fetchWithAuth(`/requests/${id}/reject?reason=${reason}`, {
      method: 'PUT',
    });
    return response.json();
  },

  // Suppliers
  getSuppliers: async () => {
    const response = await fetchWithAuth('/suppliers');
    return response.json();
  },

  getSupplierById: async (id) => {
    const response = await fetchWithAuth(`/suppliers/${id}`);
    return response.json();
  },

  searchSuppliers: async (name) => {
    const response = await fetchWithAuth(`/suppliers/search?name=${name}`);
    return response.json();
  },

  createSupplier: async (data) => {
    const response = await fetchWithAuth('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateSupplier: async (id, data) => {
    const response = await fetchWithAuth(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteSupplier: async (id) => {
    const response = await fetchWithAuth(`/suppliers/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
