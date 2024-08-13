import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const bookId = url.searchParams.get('bookId');
        const userId = url.searchParams.get('userId');
        if (!bookId || !userId) throw new Error('Book ID and User ID are required');

        const result = await sql`
        DELETE FROM Cart
        WHERE BookId = ${bookId} AND UserId = ${userId};`;

        return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            // Handle unexpected error types
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

