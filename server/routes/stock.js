const express = require('express');
const router = express.Router();
const db = require('../database');

// Get current stock price
router.get('/price', async (req, res) => {
  try {
    const price = await db.getCurrentPrice();
    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get stock price history
router.get('/history', async (req, res) => {
  try {
    const timeRange = req.query.range || 'day';
    const prices = await db.getStockPrices(timeRange);
    res.json({ prices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
