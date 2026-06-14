// Shared toast store. Mount <ToastHost /> once inside your .vsp-root, then call
// toast(...) from anywhere.
export const toasts = $state([]);
let counter = 0;

const ICON = {
  pos: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  neg: 'M18 6L6 18M6 6l12 12',
  warn: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  info: 'M12 3l1.6 5L19 9.6l-5 1.6L12 16l-1.6-4.8L5 9.6l5.4-1.6z',
};

export function toastIconPath(tone) {
  return ICON[tone ?? 'info'];
}

export function dismissToast(id) {
  const i = toasts.findIndex((x) => x.id === id);
  if (i >= 0) toasts.splice(i, 1);
}

export function toast(opts) {
  const o = typeof opts === 'string' ? { title: opts } : opts;
  const item = { id: `toast-${counter++}`, tone: 'info', ...o };
  toasts.push(item);
  if (o.duration !== Infinity) setTimeout(() => dismissToast(item.id), o.duration ?? 3600);
}
