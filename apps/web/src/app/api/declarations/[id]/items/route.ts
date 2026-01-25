import { NextRequest, NextResponse } from 'next/server';
import { addItem } from '@/server/declaration';
import { logger } from '@/server/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const item = await addItem(params.id, body);
    return NextResponse.json(item);
  } catch (error) {
    logger.error({ scope: 'api.declarations.items', msg: 'Failed to add item', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
