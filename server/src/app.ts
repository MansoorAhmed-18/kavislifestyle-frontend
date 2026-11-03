import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import paymentsRouter from './routes/payments';
import couponsRouter from './routes/coupons';
import adminRouter from './routes/admin';

export const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [env.CLIENT_URL, env.PUBLIC_SITE_URL, 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature']
}));

// Request logger
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Webhook raw body preservation & standard json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: "Kavi's Lifestyle API",
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/admin', adminRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);
