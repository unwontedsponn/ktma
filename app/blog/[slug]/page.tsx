import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Header from '@/app/sections/Header';
import Footer from '@/app/sections/Footer';
import { GlobalProvider } from '@/app/contexts/GlobalContext';
import Link from 'next/link';

interface BlogPostProps {
  content: string;
  metadata: {
    title: string;
    date: string;
    description?: string;
  };
}

async function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), 'app/blog/blogData', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContents);
  return { content, metadata: data };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { content, metadata } = await getBlogPost(params.slug);

  return (
    <GlobalProvider>
      <main className="background-light flex justify-center">
        <div className="overflow-y-auto overflow-x-hidden">
          <section id="" className="pt-[var(--header-height)] md:pb-[var(--footer-height)] flex flex-col w-screen">
            <Header />
            <div className="w-full px-4 sm:px-8 py-8 md:py-16 text-dark-500 mx-auto max-w-screen-sm sm:max-w-screen-md lg:max-w-screen-lg">
              {/* Blog title */}
              <h1 className="font-gopher-mono-semi text-4xl md:text-6xl leading-tight text-grey-black-brown mb-4">
                {metadata.title}
              </h1>

              {/* Blog description */}
              <h2 className="font-gopher-mono text-xl md:text-2xl opacity-40 mb-6">
                {metadata.description}
              </h2>

              {/* Blog date */}
              <p className="font-gopher-mono text-sm text-green mb-8">
                <small>{metadata.date}</small>
              </p>

              <Link href="/?scrollTo=myWritings" className="font-gopher-mono" id="back-to-blogs">
                Back To Blogs
              </Link>

              {/* Markdown content */}
              <ReactMarkdown className="markdown-content" remarkPlugins={[remarkGfm, remarkBreaks]}>
                {content}
              </ReactMarkdown>
            </div>
            {/* <Footer /> */}
          </section>
        </div>
      </main>
    </GlobalProvider>
  );
}
