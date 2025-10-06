import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function NewsFeed() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/news/latest?limit=10`);
      setNews(response.data.news);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="news-section">
      <h3>📰 最新消息</h3>
      <div className="news-list">
        {news.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>暂无新闻</p>
        ) : (
          news.map((item) => (
            <div 
              key={item.id} 
              className={`news-item ${item.sentiment === 'negative' ? 'negative' : ''}`}
            >
              <h4>{item.title}</h4>
              <p>{item.content}</p>
              <div className="news-date">
                {formatDate(item.date)} • {item.sentiment === 'positive' ? '📈 利好' : '📉 利空'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NewsFeed;
