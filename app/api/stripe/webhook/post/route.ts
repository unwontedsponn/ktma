import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { clearUserCart } from '@/app/utils/cart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret as string);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata.userId;

    console.log('Payment succeeded for user:', userId);

    try {
      // Attempt to clear the user's cart
      await clearUserCart(userId);
      console.log('Cart cleared for user:', userId);
    } catch (err) {
      console.error('Failed to clear the cart:', err);
      return NextResponse.json({ error: 'Failed to clear the cart' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
