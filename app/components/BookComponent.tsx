"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import SlideFadeIn from './SlideFadeIn';
import Breadcrumb from './Breadcrumb';

interface BookComponentProps {
  width: number;
  height: number;
  direction: 'left' | 'right' | 'up' | 'down';  
}

const BookComponent: React.FC<BookComponentProps> = ({ width, height, direction }) => {
  const bookPages = [
    '/myBookPages/page1.png',
    '/myBookPages/page2.png',
    '/myBookPages/page3.png',
    '/myBookPages/page4.png',
    '/myBookPages/page5.png',
    '/myBookPages/page6.png',
    '/myBookPages/page7.png',
    '/myBookPages/page8.png',
    '/myBookPages/page9.png',
    '/myBookPages/page10.png',
    '/myBookPages/page11.png',
    '/myBookPages/page12.png',
    '/myBookPages/page13.png',
  ];

  const [currentPage, setCurrentPage] = useState(0); // Start with the first page

  // The useInView hook to monitor the component's visibility
  const { ref, inView } = useInView({
    threshold: 0.1, // Adjust the threshold according to your needs
    triggerOnce: false, // This ensures the hook triggers every time the component comes into view
  });

  // useEffect to reset currentPage when component comes into view
  useEffect(() => {
    if (inView) {
      setCurrentPage(0); // Reset to the first page
    }
  }, [inView]); // Dependency on inView

  const nextPage = () => {
    setCurrentPage((current) => (current + 1) % bookPages.length);
  };

  return (
    <div ref={ref} className={`sm:hidden xl:flex`}>
      <div className="flex flex-col w-full text-center xl:text-right px-2">
        <SlideFadeIn className="border-3 border-thick-border-gray" direction={direction}>
          <div onClick={nextPage} className="cursor-pointer">
            <Image 
              src={bookPages[currentPage]} 
              alt="My Book" 
              width={width} 
              height={height}
              priority
            />
          </div>
        </SlideFadeIn>
        <SlideFadeIn direction="left">
          <Breadcrumb currentIndex={currentPage} itemCount={bookPages.length} onBreadcrumbClick={setCurrentPage} />
        </SlideFadeIn>
      </div>
    </div>
  );
};

export default BookComponent;