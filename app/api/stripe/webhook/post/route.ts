// api/stripe/webhook/post/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, stripeWebhookSecret } from '@/app/utils/stripeConfig.server';
import { clearUserCart } from '@/app/utils/clearUserCart';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret as string);} 
  catch (error) {
    const message = (error as Error).message || 'Webhook signature verification failed.';
    console.error('Webhook signature verification failed.', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata?.userId;

    console.log('Payment succeeded for user:', userId);

    if (userId) {
      try {await clearUserCart(userId);} 
      catch (error) {
        const message = (error as Error).message || 'Failed to clear the cart';
        console.error('Failed to clear the cart:', message);
        return NextResponse.json({ error: message }, { status: 500 });
      }
    } 
    else console.error('No userId in payment intent metadata');
  }
  return NextResponse.json({ received: true });
}
