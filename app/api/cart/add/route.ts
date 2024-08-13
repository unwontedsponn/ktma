import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { bookId, userId, quantity } = await request.json();
        if (!bookId || !userId || !quantity) throw new Error('Book ID, User ID, and Quantity are required');

        const bookName = "Beginner to Composer in 14 Days"; // Hardcoding for example

        const result = await sql`
        INSERT INTO Cart (BookId, UserId, BookName, Quantity)
        VALUES (${bookId}, ${userId}, ${bookName}, ${quantity})
        ON CONFLICT (BookId, UserId) 
        DO UPDATE SET Quantity = Cart.Quantity + ${quantity};`;

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            // Handle unexpected error types
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
