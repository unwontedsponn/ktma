import { sql } from '@vercel/postgres';

export async function clearUserCart(userId: string): Promise<void> {
  try {
    await sql`DELETE FROM cart WHERE userid = ${userId}`;
    console.log(`Cleared cart for user: ${userId}`);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw new Error('Failed to clear the cart');
  }
}
