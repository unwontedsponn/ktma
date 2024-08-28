// To create a payment intent when the user proceeds to checkout.
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const isLiveMode = process.env.NODE_ENV === 'production';
const stripeSecretKey = isLiveMode 
  ? process.env.STRIPE_LIVE_SECRET_KEY 
  : process.env.STRIPE_TEST_SECRET_KEY;

if (!stripeSecretKey) {console.error('Stripe Secret Key is missing');}

const stripe = new Stripe(stripeSecretKey as string, {apiVersion: '2024-06-20',});

export async function POST(req: NextRequest) {

  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('STRIPE_LIVE_SECRET_KEY:', process.env.STRIPE_LIVE_SECRET_KEY ? 'Loaded' : 'Missing');
  console.log('STRIPE_TEST_SECRET_KEY:', process.env.STRIPE_TEST_SECRET_KEY ? 'Loaded' : 'Missing');  

  try {
    const { amount, userId } = await req.json(); // Ensure you receive the userId here

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Stripe Secret Key:', stripeSecretKey ? 'Key Loaded' : 'Key Missing');

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., 1000 for $10.00)
      currency: 'usd', // Set the currency
      payment_method_types: ['card'], // Specify that payment is via card
      metadata: { userId }, // Include userId in metadata
    });
    console.log('Payment intent created with metadata:', paymentIntent.metadata);
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } 
  catch (error) {
    const message = (error as Error).message || 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}