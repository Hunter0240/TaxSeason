#!/bin/bash

# TaxSeason Local Setup Script
# This script sets up TaxSeason for personal use on your local machine

echo "==============================================="
echo "TaxSeason - Personal Setup"
echo "==============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Check if MongoDB is installed or running
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB or ensure it's in your PATH."
    echo "Alternatively, update the MongoDB connection string to use MongoDB Atlas."
    echo "Would you like to continue anyway? (y/n)"
    read continue_without_mongo
    if [ "$continue_without_mongo" != "y" ]; then
        exit 1
    fi
else
    echo "MongoDB is installed. Checking if it's running..."
    if ! pgrep mongod &> /dev/null; then
        echo "MongoDB is not running. Would you like to start it? (y/n)"
        read start_mongo
        if [ "$start_mongo" = "y" ]; then
            echo "Starting MongoDB in the background..."
            mongod --fork --logpath /tmp/mongodb.log --dbpath ~/data/db
            if [ $? -ne 0 ]; then
                echo "Failed to start MongoDB. Please start it manually and try again."
                exit 1
            fi
        fi
    else
        echo "MongoDB is running."
    fi
fi

# Create necessary directories
mkdir -p config
mkdir -p logs
mkdir -p data/backups

# Create backend .env file
echo "Creating backend environment file..."
cat > backend/.env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taxseason
JWT_SECRET=$(openssl rand -hex 32)
NODE_ENV=development
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=taxseason123
EOL

# Create frontend .env file
echo "Creating frontend environment file..."
cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WEB3_PROVIDER=http://localhost:8545
REACT_APP_CHAIN_ID=421613
EOL

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Initialize database with sample data
echo "Initializing database with sample data..."
node scripts/setup-mongodb-local.js

echo "==============================================="
echo "Setup completed successfully!"
echo "==============================================="
echo ""
echo "To start the application:"
echo "1. Run 'bash scripts/start-local.sh'"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Log in with the default credentials:"
echo "   Email: admin@example.com"
echo "   Password: taxseason123"
echo ""
echo "IMPORTANT: For security, please change the default password immediately after logging in."
echo "===============================================" 