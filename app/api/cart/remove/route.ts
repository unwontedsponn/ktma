import { sql } from '@vercel/postgres'; // Importing the sql module from Vercel Postgres to interact with the database.
import { NextResponse } from 'next/server'; // Importing NextResponse from Next.js for sending HTTP responses.

export async function DELETE(request: Request) {
    try {
        // Parse the URL from the request to extract query parameters.
        const url = new URL(request.url);
        
        // Extract the 'bookId' and 'userId' from the URL query parameters.
        const bookId = url.searchParams.get('bookId');
        const userId = url.searchParams.get('userId');
        
        // Check if both 'bookId' and 'userId' are provided. If either is missing, throw an error.
        if (!bookId || !userId) throw new Error('Book ID and User ID are required');

        // Execute the SQL query to delete the item from the 'Cart' table
        // where both the 'BookId' and 'UserId' match the provided values.
        const result = await sql`
        DELETE FROM Cart
        WHERE BookId = ${bookId} AND UserId = ${userId};`;

        // Return a JSON response with a success message and a 200 OK status.
        return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
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
