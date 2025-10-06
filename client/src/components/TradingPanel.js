import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function TradingPanel({ currentPrice }) {
  const [shares, setShares] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleBuy = async () => {
    try {
      setMessage({ type: '', text: '' });
      const response = await axios.post(
        `${API_URL}/api/user/buy`,
        { shares: parseInt(shares) },
        { withCredentials: true }
      );
      setMessage({ type: 'success', text: `成功购买 ${shares} 股！` });
      setShares(1);
      // Refresh page to update portfolio
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || '购买失败' 
      });
    }
  };

  const handleSell = async () => {
    try {
      setMessage({ type: '', text: '' });
      const response = await axios.post(
        `${API_URL}/api/user/sell`,
        { shares: parseInt(shares) },
        { withCredentials: true }
      );
      setMessage({ type: 'success', text: `成功卖出 ${shares} 股！` });
      setShares(1);
      // Refresh page to update portfolio
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || '卖出失败' 
      });
    }
  };

  const totalCost = shares * currentPrice;

  return (
    <div className="trading-section">
      <h3>💰 交易</h3>
      {message.text && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}
      <div className="trading-form">
        <div className="form-group">
          <label>股数</label>
          <input
            type="number"
            min="1"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>总价</label>
          <input
            type="text"
            value={`$${totalCost.toFixed(2)}`}
            readOnly
            style={{ backgroundColor: '#1a1f3a' }}
          />
        </div>
        <div className="button-group">
          <button 
            className="btn btn-buy" 
            onClick={handleBuy}
            disabled={shares < 1}
          >
            买入
          </button>
          <button 
            className="btn btn-sell" 
            onClick={handleSell}
            disabled={shares < 1}
          >
            卖出
          </button>
        </div>
      </div>
    </div>
  );
}

export default TradingPanel;
