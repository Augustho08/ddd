import { describe, expect, it } from 'vitest';
import { validateImageName } from '../lib/validate';

describe('validateImageName', () => {
  it('accepts valid names', () => {
    expect(validateImageName('foto.png')).toBe(true);
  });

  it('rejects invalid names', () => {
    expect(validateImageName('')).toBe(false);
    expect(validateImageName('../secret')).toBe(false);
  });
});
