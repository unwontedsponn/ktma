"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../sections/Header';
import { GlobalProvider } from '../contexts/GlobalContext';
import MyWritingsFull from './MyWritingsFull';

const MyWritingsFullPage: React.FC = () => {    

  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">        
          <Header />
          <MyWritingsFull />        
      </main>
    </GlobalProvider>
  );
};
export default MyWritingsFullPage;