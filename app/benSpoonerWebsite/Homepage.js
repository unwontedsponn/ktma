import Image from 'next/image';
import LargeScreenSection from '@/app/components/LargeScreenSection';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import RotatingWords from '../components/RotatingWords';

export default function Homepage() {

  const words = ["things", "websites", "music", "books", "films", "games", "sketches"];

  return (
    <section id="homepage" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">         

        <LargeScreenSection>
          
          {/* Left Column */}
          <div id="title-div" className="flex flex-col">   
              <SlideFadeIn direction="down" className="text-sm pl-36 color-green font-gopher-mono-semi tracking-mediumphomepage"><p>I like to get things done</p></SlideFadeIn>         

              <SlideFadeIn direction="left" className="font-gopher-mono-semi color-blue leading-none text-10xl mb-0"><p className="opacity-40">Hello,</p></SlideFadeIn>

              <SlideFadeIn direction="right" className="text-4xl max-w-2xl color-dark-blue font-gopher-mono underline tracking-largep text-decoration-color md:pl-24"><p>and I like making... </p><RotatingWords words={words} /></SlideFadeIn>

              <SlideFadeIn direction="left" className="font-gopher-mono-semi color-blue leading-none text-11xl pb-0"><p className="opacity-40">I&apos;m Ben</p></SlideFadeIn>

              <SlideFadeIn direction="up" className="pl-28 text-dark-500 font-gopher-mono tracking-smallphomepage text-xs max-w-2xl">
                {`I thrive on bringing ideas to life. From creating books and games to websites and musical pieces, I'm fueled by a passion for creative endeavors, and `}
                <span className="italic">getting things done</span>
              </SlideFadeIn>
          </div>

          {/* Right Column */}
          <SlideFadeIn className="max-w-sm border-3 border-thick-border-gray" direction="right"> 
            <Image
              src='/images/homepage-pic.jpeg'
              alt= "homepage picture"
              width= {500}
              height= {500}
              priority= 'priority'
            />
          </SlideFadeIn>

        </LargeScreenSection>
    </section>
  )
}