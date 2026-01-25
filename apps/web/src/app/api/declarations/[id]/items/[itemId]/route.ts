import { NextRequest, NextResponse } from 'next/server';
import { removeItem } from '@/server/declaration';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    await removeItem(params.itemId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to remove item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
