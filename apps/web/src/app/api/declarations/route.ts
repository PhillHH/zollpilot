import { NextResponse } from 'next/server';
import { createDraft } from '@/server/declaration';
import { prisma } from '@/server/db';
import { logger } from '@/server/logger';
import { auth } from '@/auth';

export async function POST() {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const declaration = await createDraft(session.user.tenantId, session.user.id);
    return NextResponse.json(declaration);
  } catch (error) {
    logger.error({ scope: 'api.declarations', msg: 'Failed to create declaration', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const declarations = await prisma.declaration.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(declarations);
  } catch (error) {
    logger.error({ scope: 'api.declarations', msg: 'Failed to list declarations', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
