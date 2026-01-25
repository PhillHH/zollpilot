import { z } from 'zod';

// Step 2: Parties
export const partiesSchema = z.object({
  exporter: z.object({
    name: z.string().min(1, 'Name ist erforderlich'),
    address: z.object({
      street: z.string().min(1, 'Strasse ist erforderlich'),
      city: z.string().min(1, 'Stadt ist erforderlich'),
      country: z.string().length(2, 'Ländercode muss 2-stellig sein (z.B. DE)'),
    }),
  }),
  recipient: z.object({
    name: z.string().min(1, 'Name ist erforderlich'),
    address: z.object({
      street: z.string().min(1, 'Strasse ist erforderlich'),
      city: z.string().min(1, 'Stadt ist erforderlich'),
      country: z.string().length(2, 'Ländercode muss 2-stellig sein (z.B. US)'),
    }),
  }),
  declarant: z.object({
    name: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
  }).optional(),
});

// Step 3: Transport & General
export const transportSchema = z.object({
  mode: z.string().min(1, 'Verkehrszweig ist erforderlich'),
  identity: z.string().min(1, 'Kennzeichen/Identität ist erforderlich'),
  nationality: z.string().length(2, 'Ländercode muss 2-stellig sein').optional().or(z.literal('')),
});

export const generalSchema = z.object({
  destinationCountry: z.string().length(2, 'Bestimmungsland muss 2-stellig sein'),
  exportCountry: z.string().length(2, 'Ausfuhrland muss 2-stellig sein'),
});

// Step 4: Items
export const itemDataSchema = z.object({
  description: z.string().min(1, 'Warenbezeichnung ist erforderlich'),
  commodityCode: z.string().regex(/^\d{8}$/, 'Warennummer muss 8-stellig sein'),
  grossMass: z.coerce.number().positive('Rohmasse muss > 0 sein'),
  netMass: z.coerce.number().positive('Eigenmasse muss > 0 sein'),
  invoiceAmount: z.object({
    value: z.coerce.number().nonnegative('Rechnungsbetrag muss >= 0 sein'),
    currency: z.string().length(3, 'Währung muss 3-stellig sein (z.B. EUR)').default('EUR'),
  }),
});

// Full Validation Schema for "Complete" action
export const declarationCompleteSchema = z.object({
  parties: partiesSchema,
  transport: transportSchema,
  general: generalSchema,
});
