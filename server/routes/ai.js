const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { askChatbot, generateChartConfig, generateInsights } = require('../services/aiService');

// Helper to get general DB stats for context
const getDBContext = async () => {
  const orders = await Order.find();
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
  const pending = orders.filter(o => o.status === 'Pending').length;
  const completed = orders.filter(o => o.status === 'Completed').length;
  
  // Aggregate top products
  const products = {};
  orders.forEach(o => {
    products[o.product] = (products[o.product] || 0) + (parseFloat(o.totalAmount) || 0);
  });
  
  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders: pending,
    completedOrders: completed,
    productRevenueBreakdown: products
  };
};

// 1. Chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const context = await getDBContext();
    const reply = await askChatbot(context, message);
    
    res.json({ success: true, answer: reply });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Auto Data Visualization Endpoint
router.post('/generate-chart', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });

    const widgetConfig = await generateChartConfig(prompt);
    res.json({ success: true, widget: widgetConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. AI Insights Panel
router.post('/insights', async (req, res) => {
  try {
    const context = await getDBContext();
    const insights = await generateInsights(context);
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Anomaly Detection Engine (Statistical Z-score locally)
router.get('/anomalies', async (req, res) => {
  try {
    const orders = await Order.find().lean();
    if (orders.length < 3) {
      return res.json({ success: true, data: [] }); // Not enough data for stats
    }

    const amounts = orders.map(o => parseFloat(o.totalAmount) || 0);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length);

    // Filter orders with Z-score > 2 (unusually high amounts)
    const anomalies = orders.filter(o => {
      const amt = parseFloat(o.totalAmount) || 0;
      if (stdDev === 0) return false;
      const zScore = (amt - mean) / stdDev;
      return zScore > 2; // > 2 std devs above mean
    });

    res.json({ success: true, count: anomalies.length, anomalyRecordIds: anomalies.map(a => a._id) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
