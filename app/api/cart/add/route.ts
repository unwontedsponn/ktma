import { sql } from '@vercel/postgres'; // Importing the sql module from Vercel Postgres to interact with the database.
import { NextResponse } from 'next/server'; // Importing NextResponse from Next.js for sending HTTP responses.

export async function POST(request: Request) {
    try {
        // Extract 'bookId' and 'userId' from the JSON body of the POST request.
        const { bookId, userId } = await request.json();
        
        // Check if both 'bookId' and 'userId' are provided. If either is missing, throw an error.
        if (!bookId || !userId) throw new Error('Book ID and User ID are required');

        // Execute the SQL query to insert a new entry into the 'Cart' table
        // with the provided 'BookId' and 'UserId'.
        // The 'ON CONFLICT' clause ensures that if an entry with the same 'BookId' and 'UserId' already exists,
        // the operation will do nothing (i.e., it won't insert a duplicate entry).
        const result = await sql`
        INSERT INTO Cart (BookId, UserId)
        VALUES (${bookId}, ${userId})
        ON CONFLICT (BookId, UserId) 
        DO NOTHING;`;

        // Return a JSON response with the result of the SQL query and a 200 OK status.
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        // Check if the caught error is an instance of Error (a known error type).
        if (error instanceof Error) {
            // If it is, return the error message in the response with a 500 Internal Server Error status.
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            // If the error is of an unknown type, return a generic error message.
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
