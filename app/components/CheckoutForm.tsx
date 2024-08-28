import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useGlobalContext } from '../contexts/GlobalContext';

interface CheckoutFormProps {
  clientSecret: string | null;
  closeModal: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setCartItems, setCartCount } = useGlobalContext(); // Destructure global context functions

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
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

      closeModal(); // Close the modal after successful payment
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
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
