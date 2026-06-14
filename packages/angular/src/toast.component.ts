import { Component, Input, signal } from '@angular/core';

export type ToastTone = 'info' | 'pos' | 'neg' | 'warn';
export interface ToastAction {
  label: string;
  onClick: () => void;
}
export type ToastPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';
export interface ToastOptions {
  title?: string;
  body?: string;
  tone?: ToastTone;
  /** Auto-dismiss after this many ms (default 3600). Pass `Infinity` to persist. */
  duration?: number;
  action?: ToastAction;
}
interface ToastItem extends ToastOptions {
  id: string;
}

const ICON: Record<ToastTone, string> = {
  pos: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  neg: 'M18 6L6 18M6 6l12 12',
  warn: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  info: 'M12 3l1.6 5L19 9.6l-5 1.6L12 16l-1.6-4.8L5 9.6l5.4-1.6z',
};

const toastsSignal = signal<ToastItem[]>([]);
let counter = 0;

/** Show a toast. Requires a `<vsp-toast-host />` mounted inside your `.vsp-root`. */
export function toast(opts: ToastOptions | string): void {
  const o: ToastOptions = typeof opts === 'string' ? { title: opts } : opts;
  const item: ToastItem = { id: `toast-${counter++}`, tone: 'info', ...o };
  toastsSignal.update((l) => [...l, item]);
  if (o.duration !== Infinity) {
    setTimeout(
      () => toastsSignal.update((l) => l.filter((x) => x.id !== item.id)),
      o.duration ?? 3600,
    );
  }
}

@Component({
  selector: 'vsp-toast-host',
  template: `<div class="ui-toast-region" [attr.data-position]="position">
    @for (t of toasts(); track t.id) {
      <div [class]="'ui-toast ' + (t.tone ?? 'info')" role="status">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path [attr.d]="icon(t.tone)" />
        </svg>
        <div style="flex: 1">
          <div class="ui-toast-title">{{ t.title }}</div>
          @if (t.body) {
            <div class="ui-toast-body">{{ t.body }}</div>
          }
        </div>
        @if (t.action) {
          <button type="button" class="ui-toast-action" (click)="runAction(t)">
            {{ t.action.label }}
          </button>
        }
        <button
          type="button"
          class="vsp-icon-btn"
          style="border: 0; background: transparent; width: 26px; height: 26px"
          aria-label="Dismiss"
          (click)="dismiss(t.id)"
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    }
  </div>`,
})
export class VspToastHost {
  @Input() position: ToastPosition = 'bottom-right';
  toasts = toastsSignal.asReadonly();
  icon(tone?: ToastTone): string {
    return ICON[tone ?? 'info'];
  }
  dismiss(id: string): void {
    toastsSignal.update((l) => l.filter((x) => x.id !== id));
  }
  runAction(t: ToastItem): void {
    t.action?.onClick();
    this.dismiss(t.id);
  }
}
