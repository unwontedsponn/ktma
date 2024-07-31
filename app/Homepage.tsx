import React from 'react';
import Image from 'next/image';
import homepagePic from '/public/images/homepage-pic.jpeg';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import RotatingWords from './components/RotatingWords';

const Homepage: React.FC = () => {

  const words = ["things", "websites", "music", "books", "films", "games", "sketches"];

  return (
    <section id="homepage" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">         

      <div className="flex flex-row justify-center gap-x-8 px-0 items-center h-screen overflow-hidden">
      
        {/* Left Column */}
        <div id="title-div" className="flex flex-col">   
          <SlideFadeIn direction="down" className="hidden md:block text-sm md:pl-36 color-green font-gopher-mono-semi tracking-mediumphomepage"><p>I like to get things done</p></SlideFadeIn>         

          <SlideFadeIn direction="left" className="font-gopher-mono-semi color-blue leading-none text-20vw md:text-9xl xl:text-10xl"><p className="opacity-40">Hello,</p></SlideFadeIn>

          <SlideFadeIn direction="right" className="hidden md:block text-4xl max-w-2xl color-dark-blue font-gopher-mono underline tracking-largep text-decoration-color md:pl-24"><p>and I like making... </p><RotatingWords words={words} /></SlideFadeIn>

          <SlideFadeIn direction="left" className="font-gopher-mono-semi color-blue leading-none hidden md:block text-11xl pb-0"><p className="opacity-40">I&apos;m Ben</p></SlideFadeIn>

          <SlideFadeIn direction="up" className="hidden md:block pl-28 text-dark-500 font-gopher-mono tracking-smallphomepage text-xs max-w-2xl">
            {`I thrive on bringing ideas to life. From creating books and games to websites and musical pieces, I'm fueled by a passion for creative endeavors, and `}
            <span className="italic">getting things done</span>
          </SlideFadeIn>          
        </div>

        {/* Right Column */}
        <SlideFadeIn className="hidden xl:block max-w-sm border-3 border-thick-border-gray" direction="right"> 
          <Image
            src='/images/homepage-pic.jpeg'
            alt="homepage picture"
            width={500}
            height={500}
            priority
          />
        </SlideFadeIn>      
      </div>         
    </section>
  )
}
export default Homepage;
