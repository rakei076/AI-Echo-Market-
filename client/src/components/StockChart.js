import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function StockChart({ currentPrice }) {
  const [timeRange, setTimeRange] = useState('day');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stock/history?range=${timeRange}`);
      const prices = response.data.prices.map((item, index) => ({
        time: new Date(item.timestamp).toLocaleTimeString(),
        price: item.price,
        index
      }));
      setChartData(prices);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#1a1f3a', padding: '10px', border: '1px solid #4ade80', borderRadius: '5px' }}>
          <p style={{ margin: 0, color: '#4ade80' }}>${payload[0].value.toFixed(2)}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="time-range-selector">
        <button 
          className={timeRange === 'day' ? 'active' : ''} 
          onClick={() => setTimeRange('day')}
        >
          日
        </button>
        <button 
          className={timeRange === 'week' ? 'active' : ''} 
          onClick={() => setTimeRange('week')}
        >
          周
        </button>
        <button 
          className={timeRange === 'month' ? 'active' : ''} 
          onClick={() => setTimeRange('month')}
        >
          月
        </button>
        <button 
          className={timeRange === 'year' ? 'active' : ''} 
          onClick={() => setTimeRange('year')}
        >
          年
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3548" />
          <XAxis 
            dataKey="index" 
            stroke="#94a3b8"
            tick={false}
          />
          <YAxis 
            stroke="#94a3b8"
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#4ade80" 
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;
