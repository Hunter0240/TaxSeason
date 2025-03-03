/**
 * TaxSeason MongoDB Setup Script for Personal Use
 * This script initializes the MongoDB database with the necessary collections and default user
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taxseason';
const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'taxseason123';

async function setupDatabase() {
  console.log('Connecting to MongoDB...');
  
  try {
    const client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = client.db();
    console.log('Connected to MongoDB successfully!');

    // Create collections if they don't exist
    console.log('Creating collections...');
    await db.createCollection('users');
    await db.createCollection('wallets');
    await db.createCollection('transactions');
    await db.createCollection('taxreports');

    // Create indexes
    console.log('Creating indexes...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('wallets').createIndex({ address: 1 }, { unique: true });
    await db.collection('wallets').createIndex({ userId: 1 });
    await db.collection('transactions').createIndex({ hash: 1 }, { unique: true });
    await db.collection('transactions').createIndex({ walletAddress: 1 });
    await db.collection('transactions').createIndex({ timestamp: 1 });
    await db.collection('taxreports').createIndex({ userId: 1 });

    // Check if admin user exists
    const adminUser = await db.collection('users').findOne({ email: defaultAdminEmail });
    
    if (!adminUser) {
      // Create default admin user
      console.log('Creating default admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, salt);
      
      await db.collection('users').insertOne({
        name: 'Admin User',
        email: defaultAdminEmail,
        password: hashedPassword,
        defaultTaxMethod: 'fifo',
        prefersDarkMode: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Admin user created with email: ${defaultAdminEmail}`);
    } else {
      console.log('Admin user already exists, skipping creation.');
    }

    console.log('Database setup completed successfully!');
    await client.close();
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

// Run the setup
setupDatabase()
  .then(success => {
    if (success) {
      console.log('MongoDB setup completed successfully!');
    } else {
      console.error('MongoDB setup failed!');
      process.exit(1);
    }
  }); 