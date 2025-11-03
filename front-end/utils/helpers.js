// Helper functions

// Format ngày giờ
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format ngày
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// Format số
export const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

// Format tiền
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Lấy màu status material
export const getMaterialStatusColor = (status) => {
  const colors = {
    AVAILABLE: 'bg-green-100 text-green-800',
    LOW_STOCK: 'bg-yellow-100 text-yellow-800',
    OUT_OF_STOCK: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Lấy text status material
export const getMaterialStatusText = (status) => {
  const texts = {
    AVAILABLE: 'Còn hàng',
    LOW_STOCK: 'Sắp hết',
    OUT_OF_STOCK: 'Hết hàng',
    EXPIRED: 'Hết hạn',
  };
  return texts[status] || status;
};

// Lấy màu status request
export const getRequestStatusColor = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Lấy text status request
export const getRequestStatusText = (status) => {
  const texts = {
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã phê duyệt',
    REJECTED: 'Đã từ chối',
  };
  return texts[status] || status;
};

// Lấy màu loại transaction
export const getTransactionTypeColor = (type) => {
  const colors = {
    IMPORT: 'bg-blue-100 text-blue-800',
    EXPORT: 'bg-purple-100 text-purple-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

// Lấy text loại transaction
export const getTransactionTypeText = (type) => {
  const texts = {
    IMPORT: 'Nhập kho',
    EXPORT: 'Xuất kho',
  };
  return texts[type] || type;
};

// Kiểm tra role
export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  return user.role === roles;
};
