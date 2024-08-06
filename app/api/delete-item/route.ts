import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const bookId = url.searchParams.get('bookId');
  const userId = url.searchParams.get('userId');

  if (!bookId || !userId) throw new Error('Book ID and User ID are required');

  try {
    const result = await sql`
      DELETE FROM Cart
      WHERE BookId = ${bookId} AND UserId = ${userId}
    `;
    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
