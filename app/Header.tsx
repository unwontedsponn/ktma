"use client"
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from './contexts/GlobalContext';
import Link from 'next/link';
import Contact from './Contact';
import Cart from './Cart';

const Header: React.FC = () => {
  const { cartCount } = useGlobalContext();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const toggleModal = () => setShowModal(!showModal);
  const toggleCartModal = () => setShowCartModal(!showCartModal);

  useEffect(() => {
    const headerHeight = document.querySelector<HTMLDivElement>('#header')?.offsetHeight || 0;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    const sections = ['homepage', 'aboutMe', 'myBook'];
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const navElement = document.getElementById(`${entry.target.id}Nav`);
        if (navElement) {
          if (entry.isIntersecting) navElement.classList.add('underline-nav');
          else navElement.classList.remove('underline-nav');
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section id="header" className="fixed top-0 left-0 right-0 z-10 pt-4 text-lg">
        <div className="flex justify-center items-center w-full mx-auto px-4 py-2">
          <div className="md:w-full md:mx-20 max-w-screen-xl mx-auto border-b-2 border-custom-border-color pb-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-row border-r-2 border-custom-border-color pr-6 items-center">                
                <div className="flex items-center font-gopher-mono-semi">                                                 
                  <div className="flex flex-col w-full text-center xl:text-right px-2">
                    <Link
                      href="/"
                      className="font-gopher-mono-semi"
                      id="homepageNav"
                      onClick={() => scrollToSection('homepage')}
                    >
                      benSpooner
                    </Link>
                  </div>                  
                </div>
              </div>

              <div className="flex space-x-4 font-gopher-mono">                
                <div
                  id="aboutMeNav"
                  className="hidden md:block md:border-l-2 border-custom-border-color pl-6"
                  onClick={() => scrollToSection('aboutMe')}
                >
                  aboutMe
                </div>
                <div
                  id="myBookNav"
                  className="hidden md:block border-l-2 border-custom-border-color pl-6"
                  onClick={() => scrollToSection('myBook')}
                >
                  myBook
                </div>   
                
                {/* Shopping Cart Icon */}                
                <div
                  id='cart'
                  className="hidden md:block border-l-2 border-custom-border-color pl-6 hover:cursor-pointer hover:"
                  onClick={toggleCartModal}
                >                                    
                    <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="#3f423e">
                      <path d="M7 4h-2c-.55 0-1 .45-1 1s.45 1 1 1h2l1.68 8.59c.09.46.48.79.95.79h7.5c.47 0 .86-.33.95-.79L20 6H8.25L7 4zm0 2h11.24l-1.31 6.5H9.06L7 6zm0 9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                      {cartCount > 0 && (
                        <>
                          <circle className='cart-icon-circle' cx="18" cy="6" r="6" fill="#c15564"/>
                          <text x="18" y="7" fontFamily="Gopher Mono" fontSize="8" fill="white" textAnchor="middle" alignmentBaseline="middle" dominantBaseline="middle">{cartCount}</text>
                        </>
                      )}       
                      <line x1="2" y1="22" x2="22" y2="22" stroke="#c15564" strokeWidth="3" className="cart-underline" />            
                    </svg>                                                     
                </div>
             
                <button
                  id="contactNav"
                  className="md:border-l-2 border-custom-border-color pl-6"
                  onClick={toggleModal}
                >
                  contactMe
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
      <Contact showModal={showModal} setShowModal={setShowModal} />
      <Cart showCartModal={showCartModal} setShowCartModal={setShowCartModal} />
    </>
  );
};

export default Header;
