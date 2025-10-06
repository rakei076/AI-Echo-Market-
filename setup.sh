#!/bin/bash

# AI Echo Market - Setup Script
echo "🚀 AI Echo Market Setup"
echo "======================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

echo "✅ Server dependencies installed"
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

cd ..
echo "✅ Client dependencies installed"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and add your:"
    echo "   - Google OAuth credentials"
    echo "   - OpenAI API key"
    echo "   - Session secret"
    echo ""
else
    echo "✅ .env file exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file with API keys"
echo "2. Run 'npm run dev' to start the application"
echo "3. Visit http://localhost:3000"
echo ""
