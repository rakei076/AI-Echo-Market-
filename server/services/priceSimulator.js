const db = require('../database');

let currentDayPlan = null;
let movesExecuted = 0;
let simulationInterval = null;

// Initialize or get today's trading plan
const initializeDayPlan = async () => {
  const todayNews = await db.getTodayNews();
  
  if (!todayNews) {
    console.log('No news for today, using neutral plan');
    currentDayPlan = {
      targetChange: 0,
      ups: 20,
      downs: 20,
      totalMoves: 40
    };
  } else {
    currentDayPlan = {
      targetChange: todayNews.target_change,
      ups: todayNews.ups,
      downs: todayNews.downs,
      totalMoves: todayNews.ups + todayNews.downs
    };
  }
  
  movesExecuted = 0;
  console.log('Day plan initialized:', currentDayPlan);
};

// Simulate price movement
const simulatePriceMove = async () => {
  try {
    if (!currentDayPlan || movesExecuted >= currentDayPlan.totalMoves) {
      await initializeDayPlan();
    }
    
    const currentPrice = await db.getCurrentPrice();
    let newPrice = currentPrice;
    
    const remainingUps = currentDayPlan.ups - Math.floor(movesExecuted * currentDayPlan.ups / currentDayPlan.totalMoves);
    const remainingDowns = currentDayPlan.downs - Math.floor(movesExecuted * currentDayPlan.downs / currentDayPlan.totalMoves);
    
    // Randomly decide up or down based on remaining moves
    const totalRemaining = remainingUps + remainingDowns;
    if (totalRemaining === 0) {
      movesExecuted = 0;
      return;
    }
    
    const upProbability = remainingUps / totalRemaining;
    const isUp = Math.random() < upProbability;
    
    // Calculate price change (0.1 to 2.0 points per move)
    const moveSize = 0.1 + Math.random() * 1.9;
    
    if (isUp) {
      newPrice = currentPrice + moveSize;
    } else {
      newPrice = currentPrice - moveSize;
    }
    
    // Ensure price doesn't go below 1
    newPrice = Math.max(1, newPrice);
    
    // Round to 2 decimal places
    newPrice = Math.round(newPrice * 100) / 100;
    
    await db.addStockPrice(newPrice);
    movesExecuted++;
    
    // Broadcast to connected clients
    if (global.broadcastPrice) {
      global.broadcastPrice({
        price: newPrice,
        timestamp: new Date().toISOString(),
        change: newPrice - currentPrice
      });
    }
    
    console.log(`Price updated: ${currentPrice.toFixed(2)} -> ${newPrice.toFixed(2)} (${movesExecuted}/${currentDayPlan.totalMoves})`);
  } catch (err) {
    console.error('Error simulating price move:', err);
  }
};

// Start price simulation
const startPriceSimulation = async () => {
  await initializeDayPlan();
  
  // Update price every 10 seconds (simulating real-time trading)
  simulationInterval = setInterval(simulatePriceMove, 10000);
  
  console.log('Price simulation started');
};

// Stop price simulation
const stopPriceSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('Price simulation stopped');
  }
};

module.exports = {
  startPriceSimulation,
  stopPriceSimulation
};
