# TaxSeason Troubleshooting Guide

This document provides solutions to common issues you might encounter when setting up or using TaxSeason locally.

## Installation Issues

### Node.js Version Problems

**Issue**: Error messages related to Node.js version incompatibility.

**Solution**:
1. Check your Node.js version: `node -v`
2. Ensure you have Node.js v14 or higher
3. If not, install a newer version:
   - Using NVM: `nvm install 14` then `nvm use 14`
   - Or download from [nodejs.org](https://nodejs.org/)

### MongoDB Connection Failures

**Issue**: Backend fails to start with MongoDB connection errors.

**Solution**:
1. Verify MongoDB is running: `ps aux | grep mongod`
2. Start MongoDB if needed: `mongod --dbpath ~/data/db`
3. Check your MongoDB connection string in `backend/.env`
4. Make sure the database name is correct
5. If using Atlas, verify your IP is whitelisted

### Package Installation Errors

**Issue**: npm install fails with dependency errors.

**Solution**:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Delete package-lock.json: `rm package-lock.json`
4. Try installing again: `npm install`

## Application Startup Issues

### Port Already in Use

**Issue**: Error messages about ports 3000 or 5000 already being in use.

**Solution**:
1. Find processes using the ports:
   - On macOS/Linux: `lsof -i :3000` or `lsof -i :5000`
   - On Windows: `netstat -ano | findstr :3000` or `netstat -ano | findstr :5000`
2. Kill the processes or change the ports in the `.env` files

### Application Crashes on Startup

**Issue**: The frontend or backend crashes immediately after starting.

**Solution**:
1. Check the logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check for syntax errors in any files you might have modified

## Wallet Connection Issues

### MetaMask Not Detected

**Issue**: Application cannot detect MetaMask.

**Solution**:
1. Make sure MetaMask is installed and unlocked
2. Refresh the page
3. Check if MetaMask is enabled for the site
4. Try using a different browser

### Transactions Not Loading

**Issue**: Wallet connects but transactions don't appear.

**Solution**:
1. Verify the wallet has transactions on Arbitrum One
2. Check that your wallet address is correct
3. The initial sync might take time for wallets with many transactions
4. Check the backend logs for any errors during transaction fetching

### Wallet Balance Discrepancy

**Issue**: Wallet balance in the app doesn't match actual balance.

**Solution**:
1. Refresh the wallet data
2. Check if there are any pending transactions
3. Verify that all transactions were properly synced
4. Check if you're viewing the correct network

## Tax Calculation Issues

### Incorrect Tax Calculations

**Issue**: Tax calculations seem incorrect or inconsistent.

**Solution**:
1. Verify you've selected the correct tax calculation method (FIFO, LIFO, HIFO, ACB)
2. Check that all transactions are properly categorized
3. Ensure the price data for your assets is accurate
4. Consider manual adjustments for any special cases

### Export Errors

**Issue**: Unable to export tax reports.

**Solution**:
1. Check if you have any transactions in the selected period
2. Verify all required fields are filled out
3. Try a smaller date range if dealing with many transactions
4. Check the browser console for specific error messages

## Database Issues

### Data Corruption

**Issue**: Application shows incorrect or missing data.

**Solution**:
1. Restore from a recent backup
2. If no backup is available, try repairing the database: `mongod --repair`
3. As a last resort, reset the database and reimport your wallets

### Performance Issues

**Issue**: Application becomes slow, especially with large transaction histories.

**Solution**:
1. Ensure your MongoDB has proper indexes
2. Consider limiting the date range when viewing transactions
3. Add more RAM to your MongoDB server if possible
4. Optimize queries in the application code if you have development experience

## Security Issues

### Unauthorized Access Attempts

**Issue**: You notice login attempts or suspicious activity.

**Solution**:
1. Change your admin password immediately
2. Check your system for unauthorized access
3. Make sure your MongoDB is not exposed to the internet
4. Consider implementing additional authentication measures

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Check the GitHub repository for open and closed issues that might relate to your problem
2. Search the project discussions for similar issues and solutions
3. Report a new issue with detailed information:
   - Your operating system
   - Node.js and npm versions
   - MongoDB version
   - Detailed description of the problem
   - Steps to reproduce
   - Any error messages (screenshot or copy/paste)

---

Remember that TaxSeason is a complex application dealing with financial data. If you encounter issues with tax calculations or reporting, consider consulting with a tax professional to verify the data. 