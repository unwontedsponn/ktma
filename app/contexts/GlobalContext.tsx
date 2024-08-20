"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getOrCreateGuestUserId } from '../utils/userUtils'; // Import your utility function

interface GlobalState {
  cartCount: number;
  setCartCount: (count: number) => void;
  userId: string;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [userId, setUserId] = useState<string>(''); // Initializing userId with an empty string

  useEffect(() => {
    // Fetch or create the userId when the provider mounts
    const id = getOrCreateGuestUserId();
    setUserId(id);
  }, []); // Runs only once when the component mounts

  return (
    <GlobalContext.Provider value={{ cartCount, setCartCount, userId }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
