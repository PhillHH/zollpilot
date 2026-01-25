import { NextResponse } from 'next/server';
import { createDraft } from '@/server/declaration';
import { prisma } from '@/server/db';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export async function POST() {
  try {
    const declaration = await createDraft();
    return NextResponse.json(declaration);
  } catch (error) {
    console.error('Failed to create declaration:', error);
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
    console.error('Failed to list declarations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
