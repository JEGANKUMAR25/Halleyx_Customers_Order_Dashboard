import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Orders
export const getOrders = () => API.get('/orders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const createOrder = (data) => API.post('/orders', data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// Widgets
export const getWidgets = () => API.get('/widgets');
export const createWidget = (data) => API.post('/widgets', data);
export const updateWidget = (id, data) => API.put(`/widgets/${id}`, data);
export const deleteWidget = (id) => API.delete(`/widgets/${id}`);

// AI Features
export const askAIChat = (message) => API.post('/ai/chat', { message });
export const generateChartWidget = (prompt) => API.post('/ai/generate-chart', { prompt });
export const getAIInsights = () => API.post('/ai/insights');
export const getAnomalies = () => API.get('/ai/anomalies');

export default API;
