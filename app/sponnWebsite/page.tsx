"use client"
import React from 'react';
import Header from './Header';
import Sponn from './Sponn';
import MyMusic from './myMusic/myMusic';
import MyScores from './MyScores';
import Footer from './Footer';

const Home: React.FC = () => {

  return (
    <main className="background-light flex justify-center">          
      
      <div className="hidden lg:block h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl lg:overflow-y-scroll lg:scroll-snap-y lg:scroll-snap-mandatory">
        <Header />
        <Sponn />
        <MyMusic />
        <MyScores />
        <Footer />
      </div>
    </main>
  );
}
export default Home;