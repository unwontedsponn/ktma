// Webhook Handler
// To handle Stripe webhook events, such as confirming that payment was successful and triggering order fulfillment (e.g., sending the PDF).

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const body = await req.text();  // Get raw body for verification

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret as string);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Fulfill the purchase, e.g., send the PDF to the user
    console.log('Payment succeeded:', paymentIntent);
  }

  return NextResponse.json({ received: true });
}
