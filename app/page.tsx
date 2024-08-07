"use client"
import React from 'react';
import Header from './Header';
import Homepage from './Homepage';
import AboutMe from './AboutMe';
import MyBook from './MyBook';
import Footer from './Footer';
import { GlobalProvider } from './contexts/GlobalContext';

const Home: React.FC = () => {
  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        <div className="h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl overflow-y-scroll scroll-snap-y scroll-snap-mandatory">
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
