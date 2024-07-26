"use client";
import React, { useState, useEffect } from 'react';
import Arrow from '@/app/components/Arrow';
import Link from 'next/link';
import Contact from '../Contact';

const Header: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    // Get the height of the header element
    const headerHeight = document.querySelector<HTMLDivElement>('#header')?.offsetHeight || 0;
    // Set a custom CSS property (--header-height) to the header's height
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    // Rest of this useEffect is for the Intersection Observer to add underlines
    const sections = ['homepage', 'aboutMe', 'myBook'];
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Adjust this threshold as needed
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const navElement = document.getElementById(`${entry.target.id}Nav`);
        if (navElement) { // Check if navElement exists
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
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="header" className="fixed top-0 left-0 right-0 z-10 pt-4 text-lg">
        <div className="flex justify-center items-center w-full mx-auto px-4 py-2">
          <div className="md:w-full max-w-screen-xl mx-auto border-b-2 border-custom-border-color pb-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-row border-r-2 border-custom-border-color pr-6 items-center">                
                <div className="flex items-center font-gopher-mono-semi">                 
                  <Link href="/sponnWebsite">
                    <Arrow direction="left" width={20} height={20} />
                  </Link>                  
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
                  <Link href="/sponnWebsite">
                    <Arrow direction="right" width={20} height={20} />
                  </Link>                  
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
    </>
  );
};

export default Header;
