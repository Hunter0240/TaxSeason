# TaxSeason

TaxSeason is a blockchain tax reporting application designed to collect wallet activity from various blockchain networks (initially focusing on Arbitrum One) and generate CSV files for tax reporting purposes.

## Features

- Connect and manage blockchain wallets
- Automatically fetch transaction history using The Graph protocol
- Categorize transactions for tax purposes
- Calculate tax implications using various methods (FIFO, LIFO, etc.)
- Generate CSV exports compatible with tax software
- User-friendly dashboard to visualize blockchain activity

## Tech Stack

- **Frontend**: React with TypeScript, Material UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Blockchain Data**: The Graph Protocol

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Hunter0240/TaxSeason.git
   cd TaxSeason
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory based on `.env.example`
   - Configure your MongoDB connection and other settings

### Running the Application

1. Start the backend server
   ```bash
   # In the backend directory
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   # In the frontend directory
   npm start
   ```

3. Access the application at `http://localhost:3000`

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Node.js backend API
- `/prompts` - Development documentation and guidelines

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Graph Protocol for blockchain data querying
- Material UI for the component library 