"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getOrCreateGuestUserId } from '../utils/userUtils';

interface CartItem {
  itemId: string;
  price: number;
}

interface GlobalState {
  cartCount: number;
  setCartCount: (count: number) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  userId: string;
  email: string;
  setEmail: (email: string) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string>(''); 
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Fetch or create the userId when the provider mounts
    const id = getOrCreateGuestUserId();
    setUserId(id);

    // Load cart from local storage if available
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (savedCartItems.length > 0) {
      setCartItems(savedCartItems);
      setCartCount(savedCartItems.length);
    }
  }, []); 

  useEffect(() => {
    // Update local storage whenever cartItems changes
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <GlobalContext.Provider value={{ cartCount, setCartCount, cartItems, setCartItems, userId, email, setEmail }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};