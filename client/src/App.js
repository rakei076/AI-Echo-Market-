import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import StockChart from './components/StockChart';
import NewsFeed from './components/NewsFeed';
import Portfolio from './components/Portfolio';
import TradingPanel from './components/TradingPanel';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    checkAuth();
    fetchCurrentPrice();
    connectWebSocket();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user`, { withCredentials: true });
      setUser(response.data.user);
    } catch (err) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stock/price`);
      setCurrentPrice(response.data.price);
    } catch (err) {
      console.error('Error fetching price:', err);
    }
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCurrentPrice(data.price);
      setPriceChange(data.change);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(connectWebSocket, 5000);
    };
  };

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="login-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <div className="header">
          <h1>AI Echo Market</h1>
        </div>
        <div className="login-container">
          <h2>AI 股市模拟器</h2>
          <p>
            体验由 AI 驱动的虚拟股票交易。Echo Corp 的股价完全由 AI 生成的新闻决定。
            使用虚拟资金进行买卖，测试您的交易策略。
          </p>
          <button className="google-login-btn" onClick={handleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            使用 Google 账号登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>AI Echo Market</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>欢迎, {user.name}</span>
          <button onClick={handleLogout}>登出</button>
        </div>
      </div>
      <div className="main-content">
        <div className="stock-header">
          <div className="stock-info">
            <h2>Echo Corp (ECHO)</h2>
            <div className="price-display">${currentPrice.toFixed(2)}</div>
            <div className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({((priceChange / currentPrice) * 100).toFixed(2)}%)
            </div>
          </div>
        </div>

        <StockChart currentPrice={currentPrice} />

        <div className="content-grid">
          <NewsFeed />
          <div>
            <Portfolio currentPrice={currentPrice} userId={user.id} />
            <div style={{ marginTop: '2rem' }}>
              <TradingPanel currentPrice={currentPrice} userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
