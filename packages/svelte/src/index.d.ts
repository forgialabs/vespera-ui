import type { Component } from 'svelte';

export const Button: Component<{
  variant?: 'primary' | 'ghost' | 'subtle' | 'outline' | 'danger';
  size?: 'sm';
  loading?: boolean;
  disabled?: boolean;
  children?: unknown;
}>;
export const IconButton: Component<{ label?: string; children?: unknown }>;
export const Badge: Component<{
  tone?: 'pos' | 'neg' | 'warn' | 'info' | 'muted';
  dot?: boolean;
  children?: unknown;
}>;
export const Tag: Component<{ children?: unknown; onremove?: () => void }>;
export const Kbd: Component<{ children?: unknown }>;
export const Divider: Component<{ vertical?: boolean }>;
export const Spinner: Component<{ size?: 'lg' }>;
export const Card: Component<{ pad?: boolean; children?: unknown }>;
export const CardHead: Component<{ title?: string; desc?: string; right?: unknown }>;
export const Alert: Component<{
  tone?: 'info' | 'pos' | 'warn' | 'neg';
  title?: string;
  icon?: unknown;
  action?: unknown;
  children?: unknown;
}>;
export const Field: Component<{
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children?: unknown;
}>;
export const Input: Component<{ value?: string; invalid?: boolean }>;
export const Textarea: Component<{ value?: string }>;
export const Switch: Component<{ checked?: boolean; size?: 'sm'; disabled?: boolean }>;
export const Checkbox: Component<{
  checked?: boolean;
  label?: string;
  sub?: string;
  disabled?: boolean;
}>;
