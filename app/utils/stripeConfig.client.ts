// utils/stripeConfig.client.ts
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

const isLiveMode = process.env.NODE_ENV === 'production';

// Client-side configuration
const stripePublishableKey = isLiveMode 
  ? process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY 
  : process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;

if (!stripePublishableKey) console.error('Stripe publishable key is not defined in environment variables.');

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

export { stripePromise };
export type { StripeJS };
