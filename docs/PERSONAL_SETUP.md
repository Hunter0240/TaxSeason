# TaxSeason Personal Setup Guide

This guide will help you set up TaxSeason for personal use on your local machine. TaxSeason is a tool for tracking cryptocurrency transactions and calculating tax obligations.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (usually comes with Node.js)
- **MongoDB** (Community Edition is sufficient)
- **Git** (to clone the repository)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TaxSeason.git
cd TaxSeason
```

### 2. Run the Setup Script

Our setup script will handle most of the installation process for you:

```bash
bash scripts/setup-local.sh
```

This script will:
- Check for required dependencies
- Set up environment files
- Install packages for both frontend and backend
- Initialize the database with the necessary collections
- Create a default admin user

### 3. Start the Application

To start both the backend and frontend servers:

```bash
bash scripts/start-local.sh
```

This will start:
- The backend server on port 5000
- The frontend application on port 3000

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

Log in with the default credentials:
- Email: admin@example.com
- Password: taxseason123

**Important**: For security, please change the default password immediately after logging in.

## Connecting Your Crypto Wallets

1. After logging in, navigate to the "Wallets" page
2. Click "Add Wallet"
3. Connect your wallet using MetaMask or enter your wallet address manually
4. The system will begin syncing your transaction history

Currently, TaxSeason supports the following blockchains:
- Arbitrum One

## Regular Backups

It's recommended to regularly back up your data. We've provided a backup script:

```bash
bash scripts/backup-data.sh
```

This will create a compressed backup of your database and configuration files in the `data/backups` directory.

## Customization

### Using a Different MongoDB Connection

If you want to use a cloud MongoDB instance (like MongoDB Atlas), edit the `backend/.env` file and update the `MONGODB_URI` variable:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taxseason
```

### Changing the Default Port

To change the default ports:

1. Edit `backend/.env` and change the `PORT` variable
2. Edit `frontend/.env` and update the `REACT_APP_API_URL` to match the new backend port

## Troubleshooting

### Connection Issues

If you experience connection issues with the backend:

1. Ensure MongoDB is running
2. Check that the ports 3000 and 5000 are not being used by other applications
3. Verify your firewall settings are not blocking the connections

### Wallet Connection Problems

If you have issues connecting your wallet:

1. Ensure MetaMask is installed and unlocked
2. Check that you're connected to the right network in MetaMask
3. Try refreshing the page or restarting the browser

## Security Considerations

Since this is a personal deployment:

1. **Change default passwords** immediately after setup
2. **Don't expose** the application to the internet unless you've implemented proper security measures
3. **Regularly backup** your data
4. **Keep your MongoDB** secure by using authentication and limiting access

## Need Help?

If you encounter any issues or have questions, please:

1. Check the `TROUBLESHOOTING.md` document for common issues
2. Review the GitHub issues to see if your problem has been reported
3. Open a new issue if necessary

## Advanced Configuration

For advanced configuration options, including connecting to real Ethereum nodes, setting up HTTPS, or implementing additional security measures, please refer to the documentation in the `docs` directory.

---

Happy tax tracking! We hope TaxSeason makes your crypto tax reporting easier and more manageable. 