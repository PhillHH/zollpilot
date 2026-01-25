'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db';
import { RegisterSchema } from '@/lib/schemas/auth';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: 'My Workspace',
        },
      });

      await tx.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          tenantId: tenant.id,
          role: 'ADMIN',
          name: email.split('@')[0],
        },
      });
    });

    return { success: 'User created!' };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Something went wrong!' };
  }
};
