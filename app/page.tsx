"use client"
import Header from './benSpoonerWebsite/Header';
import Homepage from './benSpoonerWebsite/Homepage';
import AboutMe from './benSpoonerWebsite/AboutMe';
import MyBook from './benSpoonerWebsite/MyBook';
import Footer from './benSpoonerWebsite/Footer';

export default function Home() {

  return (
    <main className="background-light flex justify-center">
      <div className="h-screen overflow-y-auto overflow-x-hidden max-w-screen-2xl overflow-y-scroll scroll-snap-y scroll-snap-mandatory">
        <Header />
        <Homepage />
        <AboutMe />
        <MyBook />
        <Footer />
      </div>
    </main>
  );
}
