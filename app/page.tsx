"use client"
import React from 'react';
import Header from './sections/Header';
import Homepage from './sections/Homepage';
import AboutMe from './sections/AboutMe';
import MyBook from './sections/MyBook';
import Footer from './sections/Footer';
import { GlobalProvider } from './contexts/GlobalContext';

const Home: React.FC = () => {
  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        <div className="h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl scroll-snap-y scroll-snap-mandatory">
          <Header />
          <Homepage />
          <AboutMe />
          <MyBook />
          <Footer />
        </div>
      </main>
    </GlobalProvider>
  );
};

export default Home;
