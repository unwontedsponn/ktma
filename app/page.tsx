"use client"
import Header from './benSpoonerWebsite/Header';
import Homepage from './benSpoonerWebsite/Homepage';
import AboutMe from './benSpoonerWebsite/AboutMe';
import MyBook from './benSpoonerWebsite/MyBook';
import Footer from './benSpoonerWebsite/Footer';
import MobileWebsite from './MobileWebsite';

export default function Home() {

  return (
    <main className="background-light flex justify-center">
      
      {/* Mobile View */}
      <div className="lg:hidden">        
        <MobileWebsite />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl lg:overflow-y-scroll lg:scroll-snap-y lg:scroll-snap-mandatory">
        <Header />
        <Homepage />
        <AboutMe />
        <MyBook />
        <Footer />
      </div>
    </main>
  );
}
