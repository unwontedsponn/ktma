"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Contact from '../modals/Contact';
import Cart from '../modals/Cart';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons for the hamburger menu
import ShoppingCartIcon from '../components/ShoppingCartIcon';

const Header: React.FC = () => {  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSmallViewport, setIsSmallViewport] = useState<boolean>(false);

  const toggleModal = () => setShowModal(!showModal);
  const toggleCartModal = () => setShowCartModal(!showCartModal);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const headerHeight = document.querySelector<HTMLDivElement>('#header')?.offsetHeight || 0;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    const sections = ['homepage', 'aboutMe', 'myBook', 'myGame'];
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
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  // Track viewport width for mobile menu visibility
  useEffect(() => {
    const checkViewportWidth = () => {
      setIsSmallViewport(window.innerWidth < 1024); // `md` breakpoint is 768px
    };

    // Check initial width
    checkViewportWidth();

    // Add resize event listener
    window.addEventListener('resize', checkViewportWidth);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', checkViewportWidth);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Close the menu after clicking a link
    }
  };

  return (
    <>
      <section id="header" className={`fixed inset-x-0 top-0 z-10 pt-4 text-lg`}>
        <div className={`flex items-center ${isSmallViewport ? 'justify-center space-x-4' : 'justify-between border-b-2 border-custom-border-color'} mx-auto px-4 pb-4 md:py-2 lg:max-w-screen-lg xl:max-w-screen-xl`}>
          
          {/* Logo */}
          <div 
            className={`flex items-center ${isSmallViewport ? 'hidden' : 'border-r-2 border-custom-border-color pr-4'}`}            
          >
            <Link
              href="/"
              className="font-gopher-mono-semi"              
              onClick={() => scrollToSection('homepage')}
              id="homepageNav"
            >
              benSpooner
            </Link>
          </div>

          {/* Hamburger and cart icon for small screens */}
          {isSmallViewport ? (
            <div className="flex flex-col items-center space-y-2 w-screen">
              {/* Logo and Cart */}
              <div className="flex items-center space-x-2 border-b border-custom-border-color pb-4">
                <Link
                  href="/"
                  className="font-gopher-mono-semi text-lg text-center"              
                  onClick={() => scrollToSection('homepage')}
                  id="homepageNav"
                >
                  benSpooner
                </Link>  
                {/* Cart Icon */}
                <div
                  id="cart"
                  className="cursor-pointer"
                  onClick={toggleCartModal}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCartModal(); }}
                  tabIndex={0}
                  role="button"
                >
                  <ShoppingCartIcon />
                </div>    
              </div>
              
              {/* Hamburger Menu Icon */}
              <button onClick={toggleMobileMenu} className="p-2">
                {isMobileMenuOpen ? <FiX id="FiX" size={24} /> : <FiMenu id="FiMenu" size={24} />}
              </button>                            
            </div>          
          ) : (
            // Desktop navigation
            <nav className="hidden md:flex space-x-4 font-gopher-mono">
              <Link
                href="/#aboutMe"
                id="aboutMeNav"
                className="border-l-2 border-custom-border-color pl-6 cursor-pointer"
                onClick={() => scrollToSection('aboutMe')}                
              >
                aboutMe
              </Link>
              <div
                id="myBookNav"
                className="border-l-2 border-custom-border-color pl-6 cursor-pointer"
                onClick={() => scrollToSection('myBook')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('myBook'); }}
                tabIndex={0}
                role="button"
              >
                myBook
              </div>
              <div
                id="myGameNav"
                className="border-l-2 border-custom-border-color pl-6 cursor-pointer"
                onClick={() => scrollToSection('myGame')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('myGame'); }}
                tabIndex={0}
                role="button"
              >
                myGame
              </div>              
              <Link 
                href='/blog'
                id="myWritingsNav"
                className="border-l-2 border-custom-border-color pl-6 cursor-pointer"   
              >
                myWritings
              </Link>
              <div
                id="cart"
                className="border-l-2 border-custom-border-color pl-6 cursor-pointer"
                onClick={toggleCartModal}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCartModal(); }}
                tabIndex={0}
                role="button"
              >
                <ShoppingCartIcon />
              </div>
              <button
                id="contactNav"
                className="border-l-2 border-custom-border-color pl-6"
                onClick={toggleModal}
              >
                contactMe
              </button>
            </nav>
          )}
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col items-center space-y-2 bg-white-ish py-2">
            <div 
              onClick={() => scrollToSection('aboutMe')} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('aboutMe'); }}
              tabIndex={0}
              role="menuitem"
              className="cursor-pointer"
              id="aboutMeNavMobile"
            >
              aboutMe
            </div>
            <div 
              onClick={() => scrollToSection('myBook')} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('myBook'); }}
              tabIndex={0}
              role="menuitem"
              className="cursor-pointer"
              id='myBookNavMobile'
            >
              myBook
            </div>            
            <button 
              onClick={toggleModal} 
              className="cursor-pointer"
              id="contactMeNavMobile"
            >
              contactMe
            </button>
          </div>
        )}
      </section>
      <Contact showModal={showModal} setShowModal={setShowModal} />
      <Cart showCartModal={showCartModal} setShowCartModal={setShowCartModal} />
    </>
  );
};
export default Header;