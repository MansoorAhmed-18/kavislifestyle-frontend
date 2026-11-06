import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().default('https://yxvsfaqqkfbfcjuymebo.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default('sb_publishable_xpkTcSPSAkjSfO8-3svKyw_O5tZ2M_O'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('placeholder-service-key'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().default('placeholder_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('placeholder_webhook_secret'),
  PUBLIC_SITE_URL: z.string().default('http://localhost:5173')
});

export const env = envSchema.parse(process.env);
