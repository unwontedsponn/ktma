import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SlideFadeIn from '@/app/components/SlideFadeIn';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
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
      <div className={`flex flex-col md:flex-row justify-center items-center md:gap-x-8 h-auto md:h-screen ${isNarrowViewport ? 'space-y-8' : 'overflow-hidden'}`}>
        {!isNarrowViewport ? (
          <>
            <div className="flex flex-col w-screen px-4 sm:px-8 md:px-20 py-8 md:py-16 mx-auto max-w-screen-sm sm:max-w-screen-md lg:max-w-screen-lg">       
              <SlideFadeIn direction="left" className="hidden md:block text-11xl leading-none font-gopher-mono-semi color-blue">
                <h1 className="color-blue font-gopher-mono-semi leading-none text-8xl xl:text-10xl opacity-40">myWritings</h1>
              </SlideFadeIn>

              <SlideFadeIn direction="right" className="">
                <ul>
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <li key={post.slug} className="mb-4">
                        <Link href={`/blog/${post.slug}`} className="hover:opacity-40">
                          <h2 className="font-gopher-mono-semi color-dark">{post.title}</h2>                    
                          <p className="font-gopher-mono color-dark">{post.description}</p>
                          <small className='font-gopher-mono color-green'>{post.date}</small>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <p>No posts available.</p>
                  )}
                </ul>
              </SlideFadeIn>   
            </div>                             
          </>
        ) : (
          <div className="space-y-8 px-4 sm:px-8 text-center bg-pink bg-opacity-10 py-24">
            <h1 className="color-blue font-gopher-mono-semi leading-none text-7xl opacity-40">myWritings</h1>
            <ul>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <li key={post.slug} className="mb-4">
                    <Link href={`/blog/${post.slug}`} className="hover:opacity-40">
                      <h2 className="font-gopher-mono-semi color-dark">{post.title}</h2>
                      <p className="font-gopher-mono color-dark">{post.description}</p>
                      <small className='font-gopher-mono color-green'>{post.date}</small>
                    </Link>
                  </li>
                ))
              ) : (
                <p>No posts available.</p>
              )}
            </ul>
          </div>
        )}                                
      </div>
    </section>
  );
};

export default MyWritings;
