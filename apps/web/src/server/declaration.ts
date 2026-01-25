import { prisma } from './db';
import { DeclarationStatus, ProcedureType } from '@prisma/client';

export async function createDraft(tenantId: string, userId: string) {
  return prisma.declaration.create({
    data: {
      tenantId,
      userId,
      status: DeclarationStatus.DRAFT,
      procedure: ProcedureType.EXPORT,
      step: 1,
      data: {},
    },
  });
}

export async function getDeclaration(id: string) {
  return prisma.declaration.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { sequenceNumber: 'asc' },
      },
    },
  });
}

export async function updateDeclaration(id: string, data: any, step?: number) {
  // Merge existing data with new data
  const current = await prisma.declaration.findUnique({
    where: { id },
    select: { data: true },
  });

  if (!current) throw new Error('Declaration not found');

  const currentData = (current.data as Record<string, any>) || {};
  const newData = { ...currentData, ...data };

  return prisma.declaration.update({
    where: { id },
    data: {
      data: newData,
      ...(step !== undefined && { step }),
    },
  });
}

export async function addItem(declarationId: string, itemData: any) {
  // Get max sequence number
  const lastItem = await prisma.declarationItem.findFirst({
    where: { declarationId },
    orderBy: { sequenceNumber: 'desc' },
  });
  const sequenceNumber = (lastItem?.sequenceNumber || 0) + 1;

  return prisma.declarationItem.create({
    data: {
      declarationId,
      sequenceNumber,
      data: itemData,
    },
  });
}

export async function removeItem(itemId: string) {
  return prisma.declarationItem.delete({
    where: { id: itemId },
  });
}

export async function completeDeclaration(id: string) {
  return prisma.declaration.update({
    where: { id },
    data: {
      status: DeclarationStatus.COMPLETED,
    },
  });
}
