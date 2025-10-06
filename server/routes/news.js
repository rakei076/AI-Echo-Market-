const express = require('express');
const router = express.Router();
const db = require('../database');

// Get latest news
router.get('/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const news = await db.getLatestNews(limit);
    res.json({ news });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get today's news
router.get('/today', async (req, res) => {
  try {
    const news = await db.getTodayNews();
    res.json({ news });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
