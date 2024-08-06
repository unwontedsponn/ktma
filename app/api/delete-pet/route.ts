import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const petName = searchParams.get('petName');
  const ownerName = searchParams.get('ownerName');

  try {
    if (!petName || !ownerName) throw new Error('Pet and owner names required');
    await sql`DELETE FROM Pets WHERE Name=${petName} AND Owner=${ownerName};`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Entry deleted successfully' }, { status: 200 });
}
