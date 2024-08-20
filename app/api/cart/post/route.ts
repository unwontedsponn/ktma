import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Extract itemId, price, and userId from the request body
        const { itemId, price, userId } = await request.json();

        if (!itemId || !price || !userId) {
            throw new Error('Item ID, Price, and User ID are required');
        }

        const result = await sql`
        INSERT INTO Cart (itemid, price, userid)
        VALUES (${itemId}, ${price}, ${userId})
        ON CONFLICT (itemid, userid)
        DO UPDATE SET price = ${price};`;

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
