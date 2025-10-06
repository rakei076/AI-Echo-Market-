const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const db = require('./database');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stock');
const userRoutes = require('./routes/user');
const newsRoutes = require('./routes/news');
const { startPriceSimulation } = require('./services/priceSimulator');
const { generateDailyNews } = require('./services/newsGenerator');

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./config/passport');

// Routes
app.use('/auth', authRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/user', userRoutes);
app.use('/api/news', newsRoutes);

// WebSocket for real-time price updates
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Broadcast function for price updates
global.broadcastPrice = (priceData) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(priceData));
    }
  });
};

// Initialize database and start services
db.initialize().then(() => {
  console.log('Database initialized');
  
  // Start price simulation
  startPriceSimulation();
  
  // Generate daily news at midnight
  const scheduleNextNews = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;
    
    setTimeout(() => {
      generateDailyNews();
      scheduleNextNews();
    }, timeUntilMidnight);
  };
  
  // Generate initial news if none exists
  db.getLatestNews().then((news) => {
    if (!news || news.length === 0) {
      generateDailyNews();
    }
  });
  
  scheduleNextNews();
  
  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }
  
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
