import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';

export async function GET() {
  const blogDirectory = path.join(process.cwd(), 'app/blog/blogData');
  const filenames = fs.readdirSync(blogDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(blogDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug: filename.replace('.md', ''),
      title: data.title,
      description: data.description,
      date: data.date,
    };
  });

  return NextResponse.json(posts);
}
