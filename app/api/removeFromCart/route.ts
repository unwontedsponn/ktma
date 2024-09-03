import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
    try {        
        const url = new URL(request.url);
                
        const itemId = url.searchParams.get('itemId');
        const userId = url.searchParams.get('userId');
                
        if (!itemId || !userId) throw new Error('Item ID and User ID are required');
        
        // Execute the DELETE query without assigning it to a variable
        await sql`
            DELETE FROM Cart
            WHERE itemid = ${itemId} AND userid = ${userId};
        `;
        
        return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
    } 
    catch (error) {        
        if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
