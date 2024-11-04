import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import Link from 'next/link';
import Contact from '../modals/Contact';
import Cart from '../modals/Cart';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons for the hamburger menu

const Header: React.FC = () => {
  const { cartCount } = useGlobalContext();
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
      setIsSmallViewport(window.innerWidth < 768); // `md` breakpoint is 768px
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
        <div className={`flex items-center ${isSmallViewport ? 'justify-center space-x-4' : 'justify-between'} border-b-2 border-custom-border-color mx-auto px-4 pb-4 md:py-2 max-w-screen-xl`}>
          {/* Logo */}
          <div 
            className={`flex items-center ${isSmallViewport ? '' : 'border-r-2 border-custom-border-color pr-4'}`}            
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

          {/* Hamburger icon for small screens */}
          {isSmallViewport ? (
            <button onClick={toggleMobileMenu} className="md:hidden">
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          ) : (
            // Desktop navigation
            <nav className="hidden md:flex space-x-4 font-gopher-mono">
              <div
                id="aboutMeNav"
                className="border-l-2 border-custom-border-color pl-6 cursor-pointer"
                onClick={() => scrollToSection('aboutMe')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('aboutMe'); }}
                tabIndex={0}
                role="button"
              >
                aboutMe
              </div>
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
              <div
                id="cart"
                className="border-l-2 border-custom-border-color pl-6 cursor-pointer"
                onClick={toggleCartModal}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCartModal(); }}
                tabIndex={0}
                role="button"
              >
                {/* Cart SVG */}
                <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="#3f423e">
                  <path d="M7 4h-2c-.55 0-1 .45-1 1s.45 1 1 1h2l1.68 8.59c.09.46.48.79.95.79h7.5c.47 0 .86-.33.95-.79L20 6H8.25L7 4zm0 2h11.24l-1.31 6.5H9.06L7 6zm0 9c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                  {cartCount > 0 && (
                    <>
                      <circle className='cart-icon-circle' cx="18" cy="6" r="6" fill="#c15564" />
                      <text x="18" y="7" fontFamily="Gopher Mono" fontSize="8" fill="white" textAnchor="middle" alignmentBaseline="middle" dominantBaseline="middle">{cartCount}</text>
                    </>
                  )}
                  <line x1="2" y1="22" x2="22" y2="22" stroke="#c15564" strokeWidth="3" className="cart-underline" />
                </svg>
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
          <div className="md:hidden flex flex-col items-center space-y-2 mt-2 bg-white shadow-lg py-4">
            <div 
              onClick={() => scrollToSection('aboutMe')} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('aboutMe'); }}
              tabIndex={0}
              role="menuitem"
              className="cursor-pointer"
            >
              aboutMe
            </div>
            <div 
              onClick={() => scrollToSection('myBook')} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('myBook'); }}
              tabIndex={0}
              role="menuitem"
              className="cursor-pointer"
            >
              myBook
            </div>
            <div 
              onClick={() => scrollToSection('myGame')} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToSection('myGame'); }}
              tabIndex={0}
              role="menuitem"
              className="cursor-pointer"
            >
              myBook
            </div>
            <button onClick={toggleModal} className="cursor-pointer">contactMe</button>
          </div>
        )}
      </section>
      <Contact showModal={showModal} setShowModal={setShowModal} />
      <Cart showCartModal={showCartModal} setShowCartModal={setShowCartModal} />
    </>
  );
};
export default Header;