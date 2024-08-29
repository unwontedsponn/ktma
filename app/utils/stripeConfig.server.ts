// utils/stripeConfig.server.ts
import Stripe from 'stripe';

const isLiveMode = process.env.NODE_ENV === 'production';

// Server-side configuration
const stripeSecretKey = isLiveMode 
  ? process.env.STRIPE_LIVE_SECRET_KEY 
  : process.env.STRIPE_TEST_SECRET_KEY;

const stripeWebhookSecret = isLiveMode 
  ? process.env.STRIPE_LIVE_WEBHOOK_SECRET 
  : process.env.STRIPE_TEST_WEBHOOK_SECRET;

if (!stripeSecretKey) throw new Error('Stripe Secret Key is missing');
if (!stripeWebhookSecret) throw new Error('Stripe Webhook Secret is missing');

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

export { stripe, stripeWebhookSecret };