import React from 'react';
import LargeScreenSection from '@/app/components/LargeScreenSection';
import Image from 'next/image';
import TypewriterEffect from '@/app/components/TypewriterEffect';
import SlideFadeIn from '@/app/components/SlideFadeIn';

const smallText: string = 'Drummer, pianist, composer';
const longText: JSX.Element = (
  <p>
    Rooted in my love for jazz trios, I love to create music that blurs the lines between composed arrangements and spontaneous improvisation. I hope you enjoy my <span className="italic">jazzy musings</span>.
  </p>
);

const imageAttributes = {
  id: "sponn-img",
  src: '/images/sponn.jpg',
  alt: "Sponn",
  width: 500,
  height: 500
};

const Sponn: React.FC = () => {
  return (
    <section id="sponnHomepage" className="pt-[var(--header-height)] pb-[var(--footer-height)] flex flex-col w-full h-screen overflow-hidden">
      <LargeScreenSection>
        {/* Left Column */}
        <div className="flex flex-col">
          <SlideFadeIn direction="down" className="text-sm pl-36 color-green font-gopher-mono-semi tracking-mediumphomepage">
            <p>{smallText}</p>
          </SlideFadeIn>

          <SlideFadeIn direction="left" className="color-blue font-gopher-mono-semi leading-none text-12xl">
            <h1 className="opacity-40">sponn</h1>
          </SlideFadeIn>

          <SlideFadeIn direction="right" className="color-dark-blue font-gopher-mono underline text-decoration-color text-4xl pl-32 tracking-largep whitespace-nowrap">
            <p className=""><TypewriterEffect text="some jazzy musings..." /></p>
          </SlideFadeIn>

          <SlideFadeIn direction="up" className="pl-24 pt-4 color-dark font-gopher-mono tracking-smallphomepage text-xs max-w-2xl">
            {longText}
          </SlideFadeIn>
        </div>

        {/* Right Column */}
        <SlideFadeIn className="max-w-md border-3 border-thick-border-gray" direction="right">
          <Image {...imageAttributes} />
        </SlideFadeIn>
      </LargeScreenSection>
    </section>
  );
};

export default Sponn;
