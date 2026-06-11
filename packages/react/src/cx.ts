export type ClassValue = string | number | bigint | boolean | null | undefined;

/** Join truthy class-name strings (falsy values from `cond && 'cls'` are dropped). */
export const cx = (...parts: ClassValue[]): string =>
  parts.filter((p): p is string => typeof p === 'string' && p.length > 0).join(' ');
