const express = require('express');
const router = express.Router();
const db = require('../database');

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get user portfolio
router.get('/portfolio', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const shares = await db.getUserHoldings(user.id);
    const currentPrice = await db.getCurrentPrice();
    const portfolioValue = shares * currentPrice;
    
    res.json({
      balance: user.balance,
      shares,
      currentPrice,
      portfolioValue,
      totalValue: user.balance + portfolioValue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user transactions
router.get('/transactions', isAuthenticated, async (req, res) => {
  try {
    const transactions = await db.getUserTransactions(req.user.id);
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buy stock
router.post('/buy', isAuthenticated, async (req, res) => {
  try {
    const { shares } = req.body;
    const user = req.user;
    const currentPrice = await db.getCurrentPrice();
    const totalCost = shares * currentPrice;
    
    if (totalCost > user.balance) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    
    await db.addTransaction(user.id, 'buy', shares, currentPrice);
    
    // Get updated portfolio
    const updatedUser = await db.getUserById(user.id);
    const updatedShares = await db.getUserHoldings(user.id);
    
    res.json({
      message: 'Purchase successful',
      balance: updatedUser.balance,
      shares: updatedShares
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sell stock
router.post('/sell', isAuthenticated, async (req, res) => {
  try {
    const { shares } = req.body;
    const user = req.user;
    const currentShares = await db.getUserHoldings(user.id);
    
    if (shares > currentShares) {
      return res.status(400).json({ error: 'Insufficient shares' });
    }
    
    const currentPrice = await db.getCurrentPrice();
    await db.addTransaction(user.id, 'sell', shares, currentPrice);
    
    // Get updated portfolio
    const updatedUser = await db.getUserById(user.id);
    const updatedShares = await db.getUserHoldings(user.id);
    
    res.json({
      message: 'Sale successful',
      balance: updatedUser.balance,
      shares: updatedShares
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
