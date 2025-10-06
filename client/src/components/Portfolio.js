import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Portfolio({ currentPrice }) {
  const [portfolio, setPortfolio] = useState({
    balance: 10000,
    shares: 0,
    portfolioValue: 0,
    totalValue: 10000
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/portfolio`, { withCredentials: true });
      setPortfolio(response.data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    }
  };

  // Refresh portfolio when price changes
  useEffect(() => {
    if (portfolio.shares > 0) {
      const newPortfolioValue = portfolio.shares * currentPrice;
      setPortfolio(prev => ({
        ...prev,
        currentPrice,
        portfolioValue: newPortfolioValue,
        totalValue: prev.balance + newPortfolioValue
      }));
    }
  }, [currentPrice]);

  return (
    <div className="portfolio-section">
      <h3>💼 持仓情况</h3>
      <div className="portfolio-stats">
        <div className="stat-item">
          <div className="stat-label">可用资金</div>
          <div className="stat-value">${portfolio.balance.toFixed(2)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">持有股数</div>
          <div className="stat-value">{portfolio.shares}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">持仓市值</div>
          <div className="stat-value">${portfolio.portfolioValue.toFixed(2)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">总资产</div>
          <div className="stat-value">${portfolio.totalValue.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
