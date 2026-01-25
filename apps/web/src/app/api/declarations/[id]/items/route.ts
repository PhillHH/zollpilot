import { NextRequest, NextResponse } from 'next/server';
import { addItem } from '@/server/declaration';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const item = await addItem(params.id, body);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to add item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
