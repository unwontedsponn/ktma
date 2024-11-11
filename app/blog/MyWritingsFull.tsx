"use client"
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

const MyWritingsFull: React.FC<MyWritingsProps> = ({ id }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setIsNarrowViewport] = useState(false);

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
    <section id={id} className="pt-[var(--header-height)] flex flex-col w-screen">
      <div className="flex flex-col items-center px-4 sm:px-8 md:px-20 py-8 md:py-16 mx-auto max-w-screen-lg space-y-4">                                 
        
        <SlideFadeIn direction="up">
          <div className={`grid grid-cols-1 gap-8`}>          
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
        </SlideFadeIn>                                                                          
      </div>
    </section>    
  );
};
export default MyWritingsFull;