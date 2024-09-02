// api/stripe/webhook/post/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe, stripeWebhookSecret } from '@/app/utils/stripeConfig.server';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event: Stripe.Event;

  // Verify the Stripe event
  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret as string);
  } catch (error) {
    const message = (error as Error).message || 'Webhook signature verification failed.';
    console.error('Webhook signature verification failed.', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle successful payment intent
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata?.userId;
    const email = paymentIntent.metadata?.email;

    // Log the received data
    console.log('Webhook received metadata:', { userId, email });

    console.log('Payment succeeded for user:', userId);

    // Trigger the order processing by calling the save-email (order processing) API
    if (userId) {
      try {
        // Trigger the API responsible for processing the order and clearing the cart
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/make-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, email }),
        });

        if (!response.ok) {
          throw new Error(`Failed to process order: ${response.statusText}`);
        }

        console.log(`Order processed for user: ${userId}`);
      } catch (error) {
        const message = (error as Error).message || 'Failed to process the order';
        console.error('Order processing failed:', message);
        return NextResponse.json({ error: message }, { status: 500 });
      }
    } else {
      console.error('No userId in payment intent metadata');
    }
  }

  return NextResponse.json({ received: true });
}
