import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================

// Customer Authentication
export const customerSignup = async (data) => {
  const response = await api.post('/customers/signup', data);
  return response.data;
};

export const customerLogin = async (data) => {
  const response = await api.post('/customers/login', data);
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await api.get('/customers/profile');
  return response.data;
};

export const updateCustomerProfile = async (data) => {
  const response = await api.put('/customers/profile', data);
  return response.data;
};

// Vendor Authentication
export const vendorSignup = async (data) => {
  const response = await api.post('/vendor/signup', data);
  return response.data;
};

export const vendorLogin = async (data) => {
  const response = await api.post('/vendor/login', data);
  return response.data;
};

export const getVendorProfile = async () => {
  const response = await api.get('/vendor/profile');
  return response.data;
};

export const updateVendorProfile = async (data) => {
  const response = await api.put('/vendor/profile', data);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/vendor/dashboard/stats');
  return response.data;
};

// ==================== CUSTOMER APIs ====================

// Browse Vendors
export const getAllVendors = async () => {
  const response = await api.get('/customers/vendors');
  return response.data;
};

export const getVendorById = async (vendorId) => {
  const response = await api.get(`/customers/vendors/${vendorId}`);
  return response.data;
};

export const getVendorMenu = async (vendorId) => {
  const response = await api.get(`/customers/vendors/${vendorId}/menu`);
  return response.data;
};

// ==================== VENDOR APIs ====================

// Menu Management
export const addMenuItem = async (data) => {
  // Map frontend field names to backend field names
  const backendData = {
    itemName: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    image: data.image,
    available: data.available,
  };
  const response = await api.post('/vendor/menu', backendData);
  return response.data;
};

export const getVendorMenuItems = async () => {
  const response = await api.get('/vendor/menu');
  // Backend returns array directly, map backend field names to frontend
  const items = (response.data || []).map(item => ({
    ...item,
    name: item.itemName,
  }));
  return { menuItems: items };
};

export const updateMenuItem = async (itemId, data) => {
  // Map frontend field names to backend field names
  const backendData = {
    itemName: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    image: data.image,
    available: data.available,
  };
  const response = await api.put(`/vendor/menu/${itemId}`, backendData);
  return response.data;
};

export const deleteMenuItem = async (itemId) => {
  const response = await api.delete(`/vendor/menu/${itemId}`);
  return response.data;
};

// Order Management for Vendors
export const getVendorOrders = async () => {
  const response = await api.get('/vendor/orders');
  return response.data;
};

export const getVendorOrderById = async (orderId) => {
  const response = await api.get(`/vendor/orders/${orderId}`);
  return response.data;
};

export const updateVendorOrderStatus = async (orderId, newStatus) => {
  const response = await api.patch(`/vendor/orders/${orderId}/status`, { newStatus });
  return response.data;
};

export const updateDeliveryPrice = async (data) => {
  const response = await api.put('/vendor/update-delivery-price', data);
  return response.data;
};

// ==================== CART APIs ====================

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addItemToCart = async (itemId, quantity = 1) => {
  const response = await api.post('/cart/add', { itemId, quantity });
  return response.data;
};

export const updateCartItemQuantity = async (itemId, quantity) => {
  const response = await api.post('/cart/update', { itemId, quantity });
  return response.data;
};

export const removeItemFromCart = async (itemId) => {
  const response = await api.post('/cart/remove', { itemId });
  return response.data;
};

export const clearCart = async () => {
  const response = await api.post('/cart/clear');
  return response.data;
};

// ==================== ORDER APIs ====================

export const placeOrder = async () => {
  const response = await api.post('/order/place');
  return response.data;
};

export const getCustomerOrders = async () => {
  const response = await api.get('/order/my-orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/order/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, data) => {
  const response = await api.put(`/order/${orderId}/status`, data);
  return response.data;
};

// ==================== HELPER FUNCTIONS ====================

export const saveAuthData = (token, user, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userRole', role);
};

export const getAuthData = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const role = localStorage.getItem('userRole');
  return { token, user, role };
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export default api;
