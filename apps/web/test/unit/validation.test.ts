import { describe, it, expect } from 'vitest';
import { declarationCompleteSchema, partiesSchema } from '@/lib/validation/declaration';

describe('Validation Logic', () => {
  it('should validate valid parties', () => {
    const validParties = {
      exporter: { name: 'A', address: { street: 'B', city: 'C', country: 'DE' } },
      recipient: { name: 'X', address: { street: 'Y', city: 'Z', country: 'US' } },
    };
    const result = partiesSchema.safeParse(validParties);
    expect(result.success).toBe(true);
  });

  it('should fail if country is invalid', () => {
    const invalidParties = {
      exporter: { name: 'A', address: { street: 'B', city: 'C', country: 'GERMANY' } }, // Too long
      recipient: { name: 'X', address: { street: 'Y', city: 'Z', country: 'US' } },
    };
    const result = partiesSchema.safeParse(invalidParties);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('2-stellig');
    }
  });

  it('should validate complete declaration', () => {
    const validData = {
      parties: {
        exporter: { name: 'A', address: { street: 'B', city: 'C', country: 'DE' } },
        recipient: { name: 'X', address: { street: 'Y', city: 'Z', country: 'US' } },
      },
      transport: { mode: '3', identity: 'AB-123', nationality: 'DE' },
      general: { destinationCountry: 'US', exportCountry: 'DE' },
    };
    const result = declarationCompleteSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
