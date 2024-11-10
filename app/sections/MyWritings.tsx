import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SlideFadeIn from '@/app/components/SlideFadeIn';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  isFeatured?: boolean;
}

interface MyWritingsProps {
  id?: string;
}

const MyWritings: React.FC<MyWritingsProps> = ({ id }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/getBlogPosts');
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();

    const updateViewportWidth = () => {
      setIsNarrowViewport(window.innerWidth < 768);
    };
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);  

  return (
    <section id={id} className="md:pt-[var(--header-height)] md:pb-[var(--footer-height)] flex flex-col w-screen md:h-screen">
      <div className="flex flex-col items-center px-4 sm:px-8 md:px-20 py-8 md:py-16 mx-auto max-w-screen-lg">
        
        {/* Title Section */}
        <SlideFadeIn direction="left" className="text-center text-7xl  md:text-8xl lg:text-9xl xl-text-10xl font-gopher-mono-semi color-blue mb-8">
          <h1 className="opacity-40">myWritings</h1>
        </SlideFadeIn>            

        {/* Small Devices Posts Section */}
        <div className={`md:hidden grid grid-cols-1 gap-8`}>          
          {posts.map((post) => (
            <div key={post.slug} className="transition-transform hover:scale-105">
              <Link href={`/blog/${post.slug}`} className="block p-4 border-3 border-thick-border-gray">
                <h2 className="font-gopher-mono-semi text-xl color-dark mb-2">{post.title}</h2>
                <p className="font-gopher-mono text-sm color-dark mb-4">{post.description}</p>
                <small className="font-gopher-mono color-green">{post.date}</small>
              </Link>
            </div>
          ))}
        </div>

        {/* Larger Devices Posts Section */}
        <div className={`hidden md:block gap-2`}>  
          <div className="grid grid-cols-1 gap-2">
            {posts
              .filter(post => post.isFeatured) // Filter featured posts
              .map((post, index) => ( // Map over the filtered posts
                <div key={`${post.slug}-${index}`} className="transition-transform hover:scale-105">
                  <Link href={`/blog/${post.slug}`} className="block p-4 border-3 border-thick-border-gray">
                    <h2 className="font-gopher-mono-semi text-xl color-dark mb-1">{post.title}</h2>
                    <p className="md:hidden lg:block font-gopher-mono text-sm color-dark mb-2">{post.description}</p>
                    <small className="font-gopher-mono color-green">{post.date}</small>
                  </Link>
                </div>
              ))}
          </div>                  
          <div className="flex justify-center mt-4">
            <button className="font-gopher-mono border-3 border-thick-border-gray py-2 px-4 hover:cursor-pointer hover:opacity-75">
              Read More
            </button>
          </div>   
        </div>
                          
      </div>
    </section>
  );
};

export default MyWritings;
