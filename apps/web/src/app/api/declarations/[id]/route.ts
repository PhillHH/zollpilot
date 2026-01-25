import { NextRequest, NextResponse } from 'next/server'
import { getDeclaration, updateDeclaration } from '@/server/declaration'
import { logger } from '@/server/logger'
import { z } from 'zod'

// Schema for PATCH request validation - allows partial updates
const patchRequestSchema = z
  .object({
    data: z.record(z.string(), z.unknown()).optional(),
    step: z.number().int().min(1).max(5).optional(),
  })
  .strict() // Reject unknown keys

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const declaration = await getDeclaration(params.id)
    if (!declaration) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }
    return NextResponse.json(declaration)
  } catch (error) {
    logger.error({
      scope: 'api.declarations.id',
      msg: 'Failed to fetch declaration',
      error: error as Error,
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate request body structure
    const parseResult = patchRequestSchema.safeParse(body)
    if (!parseResult.success) {
      logger.warn({
        scope: 'api.declarations.id',
        msg: 'Invalid PATCH request body',
        meta: { errors: parseResult.error.issues },
      })
      return NextResponse.json(
        { error: 'Bad Request', details: parseResult.error.issues },
        { status: 400 }
      )
    }

    const { data, step } = parseResult.data

    const declaration = await updateDeclaration(params.id, data, step)
    return NextResponse.json(declaration)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    // Handle "not found" errors with 404
    if (errorMessage === 'Declaration not found') {
      logger.warn({
        scope: 'api.declarations.id',
        msg: 'Declaration not found for PATCH',
        meta: { id: params.id },
      })
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    logger.error({
      scope: 'api.declarations.id',
      msg: 'Failed to update declaration',
      error: error as Error,
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
