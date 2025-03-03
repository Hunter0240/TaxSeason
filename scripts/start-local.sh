#!/bin/bash

# TaxSeason Local Start Script
# This script starts both the frontend and backend servers for local use

echo "==============================================="
echo "TaxSeason - Starting Application"
echo "==============================================="

# Check if MongoDB is running
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
    else
        echo "You chose not to start MongoDB. The application may not function correctly."
    fi
fi

# Function to check if a port is in use
is_port_in_use() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if ports are available
if is_port_in_use 3000; then
    echo "Port 3000 is already in use. Please free up this port before starting the frontend."
    exit 1
fi

if is_port_in_use 5000; then
    echo "Port 5000 is already in use. Please free up this port before starting the backend."
    exit 1
fi

# Start the backend server
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start the frontend server
echo "Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "==============================================="
echo "TaxSeason is now running!"
echo "==============================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api"
echo ""
echo "To stop the application, press Ctrl+C"
echo "==============================================="

# Handle graceful shutdown
trap "kill $BACKEND_PID $FRONTEND_PID; echo 'Shutting down TaxSeason...'; exit" INT TERM

# Keep script running
wait 