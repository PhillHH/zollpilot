import { NextResponse } from 'next/server';
import { createDraft } from '@/server/declaration';
import { prisma } from '@/server/db';
import { logger } from '@/server/logger';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export async function POST() {
  try {
    const declaration = await createDraft();
    return NextResponse.json(declaration);
  } catch (error) {
    logger.error({ scope: 'api.declarations', msg: 'Failed to create declaration', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const declarations = await prisma.declaration.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(declarations);
  } catch (error) {
    logger.error({ scope: 'api.declarations', msg: 'Failed to list declarations', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
