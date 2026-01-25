import { NextRequest, NextResponse } from 'next/server';
import { getDeclaration, updateDeclaration } from '@/server/declaration';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const declaration = await getDeclaration(params.id);
    if (!declaration) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(declaration);
  } catch (error) {
    console.error('Failed to fetch declaration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { data, step } = body;

    const declaration = await updateDeclaration(params.id, data, step);
    return NextResponse.json(declaration);
  } catch (error) {
    console.error('Failed to update declaration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
