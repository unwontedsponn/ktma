import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Extract itemId, price, and userId from the request body
        const { itemId, price, userId, email } = await request.json();

        if (!itemId || !price || !userId || !email) throw new Error('Item ID, Price, and User ID are required');        

        const result = await sql`
        INSERT INTO orders (itemid, price, userid, email)
        VALUES (${itemId}, ${price}, ${userId}, ${email})
        ON CONFLICT (itemid, userid)
        DO UPDATE SET price = ${price}, email = ${email};`;

        return NextResponse.json({ result }, { status: 200 });
    } 
    catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}