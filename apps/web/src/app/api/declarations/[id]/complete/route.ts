import { NextRequest, NextResponse } from 'next/server';
import { getDeclaration, completeDeclaration } from '@/server/declaration';
import { declarationCompleteSchema } from '@/lib/validation/declaration';
import { logger } from '@/server/logger';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const declaration = await getDeclaration(params.id);
    if (!declaration) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const data = declaration.data as any;
    const items = declaration.items;

    // Server-side validation
    const validationResult = declarationCompleteSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation Failed',
        details: (validationResult.error as any).errors
      }, { status: 400 });
    }

    if (items.length === 0) {
      return NextResponse.json({
        error: 'Validation Failed',
        details: 'At least one item is required'
      }, { status: 400 });
    }

    const completed = await completeDeclaration(params.id);
    return NextResponse.json(completed);
  } catch (error) {
    logger.error({ scope: 'api.declarations.complete', msg: 'Failed to complete declaration', error: error as Error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
