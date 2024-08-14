import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Extract 'bookId' and 'userId' from the JSON body of the POST request.
        const { bookId, userId } = await request.json();
                
        if (!bookId || !userId) throw new Error('Book ID and User ID are required');
        
        const result = await sql`
        INSERT INTO Cart (BookId, UserId)
        VALUES (${bookId}, ${userId})
        ON CONFLICT (BookId, UserId) 
        DO NOTHING;`;
        
        return NextResponse.json({ result }, { status: 200 });
    } 
    catch (error) {        
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
        else return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });    
    }
}
