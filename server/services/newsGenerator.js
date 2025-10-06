const OpenAI = require('openai');
const db = require('../database');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate daily news using AI
const generateDailyNews = async () => {
  try {
    console.log('Generating daily news...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial news generator for a fictional company called 'Echo Corp'. Generate realistic-sounding news that could affect stock prices. Return a JSON object with: title (string), content (string, 2-3 sentences), sentiment (either 'positive' or 'negative'), and impact (number between -50 and 50 representing expected price point change)."
        },
        {
          role: "user",
          content: "Generate a news headline and brief content for Echo Corp today."
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const newsData = JSON.parse(completion.choices[0].message.content);
    const { title, content, sentiment, impact } = newsData;
    
    // Calculate ups and downs based on impact
    const totalMoves = Math.abs(impact) * 2; // More impact = more volatility
    const targetChange = impact;
    
    let ups, downs;
    if (impact > 0) {
      // Positive news - more ups than downs
      ups = Math.ceil(totalMoves * 0.65);
      downs = Math.floor(totalMoves * 0.35);
    } else {
      // Negative news - more downs than ups
      ups = Math.floor(totalMoves * 0.35);
      downs = Math.ceil(totalMoves * 0.65);
    }
    
    const today = new Date().toISOString().split('T')[0];
    await db.addNews(title, content, sentiment, targetChange, ups, downs, today);
    
    console.log('Daily news generated successfully');
  } catch (err) {
    console.error('Error generating news:', err);
    
    // Fallback to predefined news if AI fails
    const fallbackNews = [
      {
        title: "Echo Corp Announces Strong Quarterly Earnings",
        content: "Echo Corp reported better-than-expected earnings for Q4, with revenue up 15% year-over-year. The company also announced plans to expand into new markets.",
        sentiment: "positive",
        targetChange: 25,
        ups: 30,
        downs: 10
      },
      {
        title: "Echo Corp Faces Regulatory Challenges",
        content: "The company is under scrutiny from regulators over data privacy concerns. Management stated they are cooperating fully with the investigation.",
        sentiment: "negative",
        targetChange: -20,
        ups: 10,
        downs: 25
      }
    ];
    
    const randomNews = fallbackNews[Math.floor(Math.random() * fallbackNews.length)];
    const today = new Date().toISOString().split('T')[0];
    await db.addNews(
      randomNews.title,
      randomNews.content,
      randomNews.sentiment,
      randomNews.targetChange,
      randomNews.ups,
      randomNews.downs,
      today
    );
  }
};

module.exports = { generateDailyNews };
