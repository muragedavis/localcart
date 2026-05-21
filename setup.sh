#!/bin/bash
# Setup script for LocalCart Commerce Platform

echo "🚀 LocalCart Setup Starting..."

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file from .env.example"
fi

# Initialize database
echo "🗄️  Initializing database..."
node database/migrate.js

# Seed database
echo "🌱 Seeding database..."
node database/seed.js

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your database credentials if needed"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "Admin Credentials:"
echo "Email: admin@localcart.com"
echo "Password: ChangeMe123!"
