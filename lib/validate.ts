export function validateImageName(name: string) {
  const normalized = name?.trim?.() ?? '';
  return normalized.length > 0 && !normalized.includes('..');
}

export function normalizeId(value: string) {
  return String(value ?? '').trim();
}
