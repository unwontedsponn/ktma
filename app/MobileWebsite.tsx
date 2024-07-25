import Image from 'next/image';

export default function MobileWebsite() {

  return (
    <section id="mobile-website" className="min-h-screen flex flex-col justify-center w-full space-y-6 px-4 pt-6 sm:space-y-6 sm:pt-10 md:space-y-8 md:px-6 md:pt-10">
     
      <h1 className="text-center font-gopher-mono-semi opacity-40 color-blue text-6xl sm:text-7xl md:text-8xl">
        {`Hello,`}
      </h1>
      <div className="max-w-xs mx-auto">
        <Image
          src='/images/homepage-pic.jpeg'
          alt="homepage picture"
          width={500}
          height={500}
          priority  
          className="rounded-full"
        />
      </div>        
      <h1 className="flex justify-center font-gopher-mono-semi opacity-40 color-blue text-5xl sm:text-6xl md:text-7xl whitespace-nowrap">
        {`I'm Ben`}
      </h1>      
      <p className="text-center text-gray-700 font-gopher-mono text-sm sm:text-base md:text-lg px-6">
        {`Hello! I'm Ben Spooner, a musician, aspiring full-stack developer, and technical support engineer at Neat. You are currently viewing the mobile version of my website. For the full experience, please visit on a desktop. Thank you!`}
      </p>                 
    </section>
  )
}
