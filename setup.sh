#!/bin/bash

# TaskFlow Quick Setup Script
# This script sets up the development environment

echo "🚀 TaskFlow Setup"
echo "================\n"

# Check Node version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node $(node -v) detected\n"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is running."
else
    echo "✓ PostgreSQL detected\n"
fi

# Install dependencies
echo "📦 Installing dependencies...\n"
npm run setup || exit 1

# Create .env files
echo "\n📝 Creating .env files...\n"

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env"
else
    echo "✓ backend/.env already exists"
fi

# Frontend .env
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✓ Created frontend/.env"
else
    echo "✓ frontend/.env already exists"
fi

# Check/create PostgreSQL database
echo "\n🗄️  Checking database...\n"

if psql -lqt | cut -d \| -f 1 | grep -qw taskflow; then
    echo "✓ Database 'taskflow' exists"
else
    echo "Creating database 'taskflow'..."
    createdb taskflow || echo "⚠️  Could not create database. Please create manually: createdb taskflow"
fi

# Run migrations
echo "\n🔄 Running migrations...\n"
cd backend
node src/config/migrate.js
cd ..

echo "\n✅ Setup complete!\n"
echo "📋 Next steps:"
echo "   1. Start backend: npm run backend"
echo "   2. Start frontend: npm run frontend"
echo "   3. Or run both: npm run dev\n"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:5003"
echo "\n📚 Demo credentials:"
echo "   Email: admin@demo.com"
echo "   Password: admin123\n"
echo "📖 Read more in README.md"
