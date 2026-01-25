import { NextRequest, NextResponse } from 'next/server';
import { removeItem } from '@/server/declaration';
import { logger } from '@/server/logger';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    await removeItem(params.itemId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error({ scope: 'api.declarations.items.delete', msg: 'Failed to remove item', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
