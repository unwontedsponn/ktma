// api/make-order
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Extract necessary data from the request body
        const { userId, email } = await request.json();        

        // Check for missing fields
        if (!userId || !email) throw new Error('User ID and email are required');

        // Start a transaction to move data from cart to orders and clear the cart
        await sql`BEGIN;`;

        try {
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

            // Return a success response
            return NextResponse.json({ message: 'Cart items moved to orders, cart cleared successfully & order processed successfully' }, { status: 200 });
        } catch (innerError) {            
            await sql`ROLLBACK;`;            
            throw new Error('Unknown error occurred during database transaction');
        }
    } 
    catch (error) {return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });}
}
