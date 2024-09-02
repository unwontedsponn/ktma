// api/orders/make-order
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Extract necessary data from the request body
        const { userId, email } = await request.json();

        // Log the incoming request data
        console.log('Incoming data:', { userId, email });

        // Check for missing fields
        if (!userId || !email) throw new Error('User ID and email is required');

        // Start a transaction to move data from cart to orders and clear the cart
        await sql`BEGIN;`;

        // Insert data from cart into orders
        await sql`
        INSERT INTO orders (item_id, price, user_id, email)
        SELECT itemid, price, CAST(userid AS uuid), email FROM cart
        WHERE userid = ${userId};
        `;

        // Clear the cart for the user
        await sql`
        DELETE FROM cart
        WHERE userid = ${userId};
        `;

        // Commit the transaction
        await sql`COMMIT;`;

        // Log success message
        console.log('Cart items moved to orders and cart cleared successfully.');

        // Return a success response
        return NextResponse.json({ message: 'Order processed successfully' }, { status: 200 });
    } 
    catch (error) {
        // Rollback the transaction in case of an error
        await sql`ROLLBACK;`;

        // Log the error message for debugging
        console.error('Error processing request:', error);

        // Return an error response with the error message
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}