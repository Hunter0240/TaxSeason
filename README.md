# TaxSeason

TaxSeason is a blockchain tax reporting application designed to help users track and manage their cryptocurrency transactions for tax reporting purposes. Initially focusing on Arbitrum One blockchain, it collects wallet activity and generates tax reports in various formats.

## Features

- Connect and manage blockchain wallets
- Automatically fetch transaction history using The Graph protocol
- Categorize transactions for tax purposes
- Calculate tax implications using various methods (FIFO, LIFO, HIFO, ACB)
- Generate CSV and PDF exports compatible with tax software
- User-friendly dashboard to visualize blockchain activity
- User authentication and profile management
- Customizable tax settings and preferences

## Tech Stack

- **Frontend**: React with TypeScript, Material UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Blockchain Data**: The Graph Protocol
- **Authentication**: JWT, bcrypt

## Getting Started

### For Personal Use

We've simplified the setup process for personal use:

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/TaxSeason.git
   cd TaxSeason
   ```

2. Run the setup script
   ```bash
   bash scripts/setup-local.sh
   ```

3. Start the application
   ```bash
   bash scripts/start-local.sh
   ```

4. Access the application at `http://localhost:3000`
   - Default login: admin@example.com
   - Default password: changeme123

For detailed instructions, see [Personal Setup Guide](docs/PERSONAL_SETUP.md).

### Manual Installation

1. Clone the repository

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

5. Start the backend server
   ```bash
   # In the backend directory
   npm run dev
   ```

6. Start the frontend development server
   ```bash
   # In the frontend directory
   npm start
   ```

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Node.js backend API
- `/scripts` - Setup and utility scripts for local deployment
- `/docs` - User documentation and guides

## Documentation

- [Personal Setup Guide](docs/PERSONAL_SETUP.md) - How to set up TaxSeason for personal use
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Solutions to common issues
- [Backup and Restore Guide](docs/BACKUP_RESTORE.md) - How to back up and restore your data

## Current Development Focus

The current development phase focuses on personal deployment configuration and connecting to real blockchain wallets.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Graph Protocol for blockchain data querying
- Material UI for the component library 