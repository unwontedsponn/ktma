"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useGlobalContext } from './contexts/GlobalContext';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './components/CheckoutForm';
import { stripePromise } from './utils/stripeConfig.client';

interface CartItem {
  itemId: string;
  price: number;
}

interface CartProps {
  showCartModal: boolean;
  setShowCartModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<CartProps> = ({ showCartModal, setShowCartModal }) => {
  const { cartItems, setCartItems, setCartCount, userId } = useGlobalContext();
  const [showCheckout, setShowCheckout] = useState(false); // Track whether to show checkout form
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const fetchCartItems = useCallback(async () => {
    try {
      // Define an async function inside useCallback
      const response = await fetch(`/api/cart/get?userId=${userId}`);
      const data = await response.json();

      const mappedData: CartItem[] = data.map((item: { price: number; userid: string; itemid: string }) => ({
        itemId: item.itemid,
        price: item.price,
      }));

      setCartItems(mappedData);
      setCartCount(mappedData.length);
    } 
    catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  }, [userId, setCartItems, setCartCount]); // Ensure to include all dependencies

  const removeItemFromCart = async (itemId: string) => {
    try {
      await fetch(`/api/cart/delete?itemId=${itemId}&userId=${userId}`, { method: 'DELETE' });
      const newCartItems = cartItems.filter(item => item.itemId !== itemId);
      setCartItems(newCartItems);
      setCartCount(newCartItems.length);
    } 
    catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const handleBuyItems = async () => {
    // Calculate the total amount
    const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

    try {
      // Create the payment intent
      const response = await fetch('/api/stripe/payment-intent/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // Amount in cents
          userId,
        }),
      });

      const data = await response.json();
      console.log('Payment intent response:', data); // Add this log
      setClientSecret(data.clientSecret); // Store the client secret
      setShowCheckout(true); // Show checkout form
    } 
    catch (error) {
      console.error('Failed to create payment intent:', error);
    }
  };

  const closeModal = () => {
    setShowCheckout(false); // Reset checkout form
    setShowCartModal(false); // Close the modal
  };

  useEffect(() => {
    if (showCartModal) fetchCartItems();
  }, [showCartModal, fetchCartItems]);

  return (
    <div
      id="myModal"
      className={`fixed inset-0 z-10 bg-black/40 ${showCartModal ? 'block' : 'hidden'}`}
    >
      <div className="modal-content bg-white m-auto p-5 border-3 border-thick-border-gray w-4/5 md:w-1/2 lg:w-1/3 shadow-lg">
        <span
          className="float-right text-3xl font-bold text-gray-400 cursor-pointer hover:text-black focus:text-black close"
          role="button"
          tabIndex={0}
          onClick={closeModal}
          onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') closeModal();}}
        >
          &times;
        </span>
        {!showCheckout ? (
          <div className="space-y-2">
            <p className="font-gopher-mono-semi text-xl">Shopping Cart Items:</p>
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <div key={item.itemId} className="font-gopher-mono">
                    <span>- {item.itemId}</span>
                    <span> £{item.price} </span>
                    <span
                      className="hover:cursor-pointer hover:opacity-50 text-darkPink font-gopher-mono-semi"
                      role="button"
                      tabIndex={0}
                      onClick={() => removeItemFromCart(item.itemId)}
                      onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') removeItemFromCart(item.itemId);}}
                    >
                      X
                    </span>

                  </div>
                ))}
                {/* Conditionally render the BUY ITEMS button only if there are items in the cart */}
                <button
                  className="border-3 border-thick-border-gray py-2 px-3 hover:cursor-pointer hover:opacity-50"
                  onClick={handleBuyItems}
                >
                  CHECKOUT
                </button>
              </>
            ) : (
              <p className="font-gopher-mono">No items in the cart.</p>
            )}
          </div>
        ) : (
          stripePromise && (
            <Elements stripe={stripePromise}>
              <CheckoutForm clientSecret={clientSecret} closeModal={closeModal} />
            </Elements>
          )
        )}
      </div>
    </div>
  );
};

export default Cart;
