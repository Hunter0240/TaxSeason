import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import walletRoutes from './routes/walletRoutes';
import transactionRoutes from './routes/transactionRoutes';
import taxRoutes from './routes/taxRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taxseason';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to TaxSeason API' });
});

// API routes
app.use('/api/wallets', walletRoutes);
app.use('/api', transactionRoutes);
app.use('/api', taxRoutes);
// Add other routes as they are developed
// app.use('/api/export', exportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 