"use client";
import React from 'react';
import Header from '../sections/Header';
import { GlobalProvider } from '../contexts/GlobalContext';
import MyWritingsFull from './MyMusingsList';

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