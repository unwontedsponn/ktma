import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SlideFadeIn from '@/app/components/SlideFadeIn';
import TypewriterEffect from '../components/TypewriterEffect';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  isFeatured?: boolean;
}

interface MyMusingsProps {
  id?: string;
}

// Component to display a single blog post
const BlogPost: React.FC<{ post: Post }> = ({ post }) => (
  <div className="transition-transform hover:scale-105">
    <Link href={`/blog/${post.slug}`} className="block p-4 border-3 border-thick-border-gray">
      <h2 className="font-gopher-mono-semi text-xl color-dark mb-1">{post.title}</h2>
      <p className="font-gopher-mono text-xs lg:text-sm color-dark mb-2">{post.description}</p>
      <small className="font-gopher-mono color-green">{post.date}</small>
    </Link>
  </div>
);

const MyMusings: React.FC<MyMusingsProps> = ({ id }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/getBlogPosts');
      const data = await res.json();
      setPosts(data);
    };

    const updateViewportWidth = () => {
      setIsNarrowViewport(window.innerWidth < 768);
    };

    fetchPosts();
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);

    return () => window.removeEventListener('resize', updateViewportWidth);
  }, []);

  return (
    <section
      id={id}
      className={`md:pt-[var(--header-height)] md:pb-[var(--footer-height)] flex flex-col w-screen md:h-screen ${isNarrowViewport ? 'bg-pink bg-opacity-10' : ''} overflow-x-hidden`}
    >
      <div className="flex flex-col items-center px-4 sm:px-8 md:px-20 py-8 md:py-16 mx-auto max-w-screen-lg w-full space-y-4 md:space-y-0">
        
        {/* Title Section */}
        <div className="text-center font-gopher-mono-semi color-blue max-w-full">
          {/* Larger Screens with SlideFadeIn */}
          <div className="hidden md:block">
            <SlideFadeIn direction="left" className="text-8xl lg:text-9xl xl-text-10xl">
              <h1 className="opacity-40">myMusings</h1>
            </SlideFadeIn>
            <SlideFadeIn direction="right" className="font-gopher-mono underline text-decoration-color tracking-largep text-xl lg:text-2xl color-dark-blue mb-4">
              <p><TypewriterEffect text="Featured pieces..." /></p>
            </SlideFadeIn>
          </div>

          {/* Smaller Screens without SlideFadeIn */}
          <div className="md:hidden space-y-4">
            <h1 className="text-6xl opacity-40">myMusings</h1>
            <p className="text-xl sm:text-2xl font-gopher-mono underline color-dark-blue tracking-wide sm:tracking-large whitespace-nowrap text-decoration-color">
              <TypewriterEffect text="Featured pieces..." />
            </p>
          </div>
        </div>                                                                                 

        {/* Small Devices Posts Section */}
        <SlideFadeIn direction="right">
          <div className="gap-2 px-4 w-full max-w-[95%] mx-auto">
            <div className="grid grid-cols-1 gap-2">
              {posts
                .filter(post => post.isFeatured)
                .map((post, index) => (
                  <BlogPost key={`${post.slug}-${index}`} post={post} />
                ))}
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/blog">
                <button className="font-gopher-mono border-3 border-thick-border-gray py-2 px-4 hover:cursor-pointer hover:opacity-75 text-base md:text-xs lg:text-base">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        </SlideFadeIn>
      </div>
    </section>
  );
};

export default MyMusings;
