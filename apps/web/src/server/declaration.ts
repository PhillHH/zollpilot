import { prisma } from './db';
import { DeclarationStatus, ProcedureType } from '@prisma/client';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
const DEFAULT_USER_EMAIL = 'admin@local.test';

async function getDefaultUser() {
  const user = await prisma.user.findFirst({
    where: { email: DEFAULT_USER_EMAIL, tenantId: DEFAULT_TENANT_ID },
  });
  if (!user) throw new Error('Default user not found. Please run seed.');
  return user;
}

export async function createDraft() {
  const user = await getDefaultUser();

  return prisma.declaration.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      userId: user.id,
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
