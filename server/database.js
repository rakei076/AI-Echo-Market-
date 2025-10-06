const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'market.db');
const db = new sqlite3.Database(dbPath);

const initialize = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        name TEXT,
        balance REAL DEFAULT 10000.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Stock prices table
      db.run(`CREATE TABLE IF NOT EXISTS stock_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        price REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // News table
      db.run(`CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        sentiment TEXT NOT NULL,
        target_change REAL NOT NULL,
        ups INTEGER NOT NULL,
        downs INTEGER NOT NULL,
        date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Transactions table
      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        shares INTEGER NOT NULL,
        price REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);

      // Holdings table
      db.run(`CREATE TABLE IF NOT EXISTS holdings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        shares INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`, (err) => {
        if (err) reject(err);
        else {
          // Initialize stock price if not exists
          db.get('SELECT COUNT(*) as count FROM stock_prices', (err, row) => {
            if (!err && row.count === 0) {
              db.run('INSERT INTO stock_prices (price) VALUES (100.0)');
            }
          });
          resolve();
        }
      });
    });
  });
};

// User operations
const createUser = (googleId, email, name) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO users (google_id, email, name) VALUES (?, ?, ?)',
      [googleId, email, name],
      function(err) {
        if (err) reject(err);
        else {
          db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, user) => {
            if (err) reject(err);
            else {
              // Create holdings entry for new user
              if (this.changes > 0) {
                db.run('INSERT INTO holdings (user_id, shares) VALUES (?, 0)', [user.id]);
              }
              resolve(user);
            }
          });
        }
      }
    );
  });
};

const getUserByGoogleId = (googleId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Stock price operations
const getCurrentPrice = () => {
  return new Promise((resolve, reject) => {
    db.get('SELECT price FROM stock_prices ORDER BY id DESC LIMIT 1', (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.price : 100.0);
    });
  });
};

const addStockPrice = (price) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO stock_prices (price) VALUES (?)', [price], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

const getStockPrices = (timeRange) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM stock_prices ORDER BY timestamp DESC';
    let limit;
    
    switch(timeRange) {
      case 'day':
        limit = 390; // ~6.5 hours of trading
        break;
      case 'week':
        limit = 1950; // 5 trading days
        break;
      case 'month':
        limit = 8190; // ~21 trading days
        break;
      case 'year':
        limit = 98280; // ~252 trading days
        break;
      default:
        limit = 390;
    }
    
    db.all(`${query} LIMIT ?`, [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.reverse());
    });
  });
};

// News operations
const addNews = (title, content, sentiment, targetChange, ups, downs, date) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO news (title, content, sentiment, target_change, ups, downs, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, content, sentiment, targetChange, ups, downs, date],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

const getLatestNews = (limit = 10) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM news ORDER BY date DESC, created_at DESC LIMIT ?', [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getTodayNews = () => {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];
    db.get('SELECT * FROM news WHERE date = ? ORDER BY created_at DESC LIMIT 1', [today], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Transaction operations
const addTransaction = (userId, type, shares, price) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      db.run(
        'INSERT INTO transactions (user_id, type, shares, price) VALUES (?, ?, ?, ?)',
        [userId, type, shares, price],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
            return;
          }
          
          const totalCost = shares * price;
          
          if (type === 'buy') {
            // Deduct balance and add shares
            db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [totalCost, userId], (err) => {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
                return;
              }
              db.run('UPDATE holdings SET shares = shares + ? WHERE user_id = ?', [shares, userId], (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  reject(err);
                } else {
                  db.run('COMMIT');
                  resolve(this.lastID);
                }
              });
            });
          } else {
            // Add balance and remove shares
            db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [totalCost, userId], (err) => {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
                return;
              }
              db.run('UPDATE holdings SET shares = shares - ? WHERE user_id = ?', [shares, userId], (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  reject(err);
                } else {
                  db.run('COMMIT');
                  resolve(this.lastID);
                }
              });
            });
          }
        }
      );
    });
  });
};

const getUserHoldings = (userId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT shares FROM holdings WHERE user_id = ?', [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.shares : 0);
    });
  });
};

const getUserTransactions = (userId, limit = 50) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?',
      [userId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

module.exports = {
  initialize,
  createUser,
  getUserByGoogleId,
  getUserById,
  getCurrentPrice,
  addStockPrice,
  getStockPrices,
  addNews,
  getLatestNews,
  getTodayNews,
  addTransaction,
  getUserHoldings,
  getUserTransactions
};
