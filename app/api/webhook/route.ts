import { NextRequest, NextResponse } from 'next/server';
import { stripe, stripeWebhookSecret } from '@/app/utils/stripeConfig.server';
import { sendEmail } from '@/app/utils/sendEmail';
import path from 'path';
import fs from 'fs/promises';

interface Metadata {
  userId?: string;
  email?: string;
  productId?: string;
  productName?: string;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig!, stripeWebhookSecret as string);

    if (event.type === 'payment_intent.succeeded') {
      const { userId, email, productId, productName } = (event.data.object as { metadata: Metadata }).metadata || {};

      if (userId && email && productId && productName) {
        try {
          // Check which product was purchased and fetch the corresponding PDF
          let bookPath;
          if (productId === 'prod_OnfpVYi2z8WURa') { // Ensure this matches your product ID
            bookPath = path.resolve(process.cwd(), 'assets', 'Beginner to Composer.pdf');
          }

          if (bookPath) {
            const bookPDF = await fs.readFile(bookPath);
            // Call sendEmail with the correct arguments
            await sendEmail(
              email, 
              bookPDF, 
              `Your Purchase: ${productName}`, 
              'Thank you for your purchase! Attached is your PDF.'
            );
            return NextResponse.json({ message: 'PDF sent successfully' }, { status: 200 });
          } else {
            return NextResponse.json({ error: 'Product PDF not found' }, { status: 404 });
          }
        } catch (emailError) {
          console.error('Failed to send PDF email:', emailError);
          return NextResponse.json({ error: 'Failed to send PDF email' }, { status: 500 });
        }
      } else {
        console.error('Missing metadata in payment intent');
        return NextResponse.json({ error: 'Missing userId, email, productId, or productName in payment intent metadata' }, { status: 400 });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook Error', details: error }, { status: 400 });
  }
}
