import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) throw new Error('User ID is required');

        const result = await sql`
        SELECT itemid, price FROM Cart
        WHERE userid = ${userId};`;

        return NextResponse.json(result.rows, { status: 200 });
    } 
    catch (error) {        
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
