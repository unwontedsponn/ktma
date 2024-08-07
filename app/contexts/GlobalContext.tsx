"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GlobalState {
  cartCount: number;
  setCartCount: (count: number) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <GlobalContext.Provider value={{ cartCount, setCartCount }}>
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
