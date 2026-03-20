const express = require('express');
const router = express.Router();
const Widget = require('../models/Widget');

// GET all widgets
router.get('/', async (req, res) => {
  try {
    const widgets = await Widget.find().sort({ createdAt: 1 });
    res.json({ success: true, data: widgets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single widget
router.get('/:id', async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id);
    if (!widget) return res.status(404).json({ success: false, message: 'Widget not found' });
    res.json({ success: true, data: widget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create widget
router.post('/', async (req, res) => {
  try {
    const widget = new Widget(req.body);
    const saved = await widget.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update widget (settings + position)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Widget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Widget not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE widget
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Widget.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Widget not found' });
    res.json({ success: true, message: 'Widget deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
