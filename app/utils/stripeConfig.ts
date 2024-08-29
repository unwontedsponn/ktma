// utils/stripeConfig.ts
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';
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

// Client-side configuration
const stripePublishableKey = isLiveMode 
  ? process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY 
  : process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;

if (!stripePublishableKey) console.error('Stripe publishable key is not defined in environment variables.');

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export { stripe, stripePromise, stripeWebhookSecret };
export type { StripeJS };