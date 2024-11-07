// app/blog/index.tsx
import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Header from '../sections/Header';
import Footer from '../sections/Footer';
import { GlobalProvider } from '../contexts/GlobalContext';

const Blog = () => {
  // Read all files from blogData folder
  const blogDirectory = path.join(process.cwd(), 'app/blog/blogData');
  const filenames = fs.readdirSync(blogDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(blogDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug: filename.replace('.md', ''),
      title: data.title,
      date: data.date,
      description: data.description,
    };
  });

  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        <div className='overflow-y-auto overflow-x-hidden'>
          <section id="" className="pt-[var(--header-height)] md:pb-[var(--footer-height)] flex flex-col w-screen md:h-screen">
            <Header />
            <div className="w-full px-4 sm:px-8 py-8 md:py-16 text-dark-500 mx-auto max-w-screen-sm sm:max-w-screen-md lg:max-w-screen-lg">
              <h1 className="color-blue font-gopher-mono-semi leading-none text-10xl opacity-40">myWritings</h1>
              <ul>
                {posts.map((post) => (
                  <li key={post.slug} className="mb-4">
                    <Link href={`/blog/${post.slug}`} className="hover:opacity-40">
                      <h2 className="font-gopher-mono-semi color-dark">{post.title}</h2>                    
                      <p className="font-gopher-mono color-dark">{post.description}</p>
                      <small className='font-gopher-mono color-green'>{post.date}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>            
            <Footer />
          </section>          
        </div>      
      </main>
    </GlobalProvider>    
  );
};

export default Blog;
