import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useGlobalContext } from '../contexts/GlobalContext';

interface CheckoutFormProps {
  clientSecret: string | null;
  closeModal: () => void;
}

const cardElementStyles = {
  base: {
    fontFamily: "'Gopher Mono', monospace",
    fontSize: '16px',
    color: '#3f423e',
    '::placeholder': {
      color: '#c15564',
    },    
    iconColor: '#407dbf',
  },
  invalid: {
    color: '#4a713f',
  },
  complete: {
    color: '#334862',
  },
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example: Fetching values from the Global Context
  const { email, cartItems, userId, setCartItems, setCartCount } = useGlobalContext();

  // Assume we are dealing with a single item in the cart for simplicity
  const itemId = cartItems.length > 0 ? cartItems[0].itemId : null;
  const price = cartItems.length > 0 ? cartItems[0].price : null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || !itemId || !price || !userId) {
      setError('Missing required data');
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
        billing_details: { email },
      },
    });

    if (error) {
      setError(error.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Clear the client-side cart after successful payment
      setCartItems([]);
      setCartCount(0);
      
      alert('Payment successful! Thank you for your purchase.');

      // Send order details to backend including email
      await fetch('/api/make-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, price, userId, email }), // Send all required fields
      });

      closeModal(); // Close the modal after successful payment
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-gopher-mono-semi mb-4">CHECKOUT</h2>    
      
      <CardElement options={{ style: cardElementStyles }} />

      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="mt-4 border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};
export default CheckoutForm;