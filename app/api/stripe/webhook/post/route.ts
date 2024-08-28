import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clearUserCart } from '@/app/utils/clearUserCart';

const isLiveMode = process.env.NODE_ENV === 'production'; // Or use a custom flag
const stripeSecretKey = isLiveMode ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;
const stripeWebhookSecret = isLiveMode ? process.env.STRIPE_LIVE_WEBHOOK_SECRET : process.env.STRIPE_TEST_WEBHOOK_SECRET;

const stripe = new Stripe(stripeSecretKey as string, {apiVersion: '2024-06-20',});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret as string);
  } catch (error) {
    const message = (error as Error).message || 'Webhook signature verification failed.';
    console.error('Webhook signature verification failed.', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata?.userId;

    console.log('Payment succeeded for user:', userId);

    if (userId) {
      try {
        // Attempt to clear the user's cart
        await clearUserCart(userId);
        console.log('Cart cleared for user:', userId);
      } catch (error) {
        const message = (error as Error).message || 'Failed to clear the cart';
        console.error('Failed to clear the cart:', message);
        return NextResponse.json({ error: message }, { status: 500 });
      }
    } else {
      console.error('No userId in payment intent metadata');
    }
  }

  return NextResponse.json({ received: true });
}
