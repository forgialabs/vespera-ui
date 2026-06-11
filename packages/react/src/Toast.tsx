import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon, type IconComponent } from '@vespera-ui/icons';
import { getPortalTarget } from './portal';
import { cx } from './cx';

export type ToastTone = 'info' | 'pos' | 'neg' | 'warn';

export interface ToastOptions {
  title?: ReactNode;
  body?: ReactNode;
  tone?: ToastTone;
  icon?: ReactNode;
  /** Auto-dismiss after this many ms (default 3600). */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

const toneIcon: Record<ToastTone, IconComponent> = {
  pos: Icon.checkCircle,
  neg: Icon.x,
  warn: Icon.bell,
  info: Icon.sparkle,
};

let listeners: ((t: ToastItem) => void)[] = [];
let counter = 0;

/** Show a toast. Requires a `<ToastHost />` mounted inside your `.vsp-root`. */
export function toast(opts: ToastOptions | string) {
  const o: ToastOptions = typeof opts === 'string' ? { title: opts } : opts;
  const item: ToastItem = { id: `toast-${counter++}`, tone: 'info', ...o };
  listeners.forEach((l) => l(item));
}

export function ToastHost() {
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    setMounted(true);
    const add = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      window.setTimeout(
        () => setToasts((prev) => prev.filter((x) => x.id !== t.id)),
        t.duration ?? 3600,
      );
    };
    listeners.push(add);
    return () => {
      listeners = listeners.filter((l) => l !== add);
    };
  }, []);

  const target = mounted ? getPortalTarget() : null;
  if (!target) return null;

  return createPortal(
    <div className="ui-toast-region">
      {toasts.map((t) => {
        const Fallback = toneIcon[t.tone ?? 'info'];
        return (
          <div key={t.id} className={cx('ui-toast', t.tone)}>
            {t.icon ?? <Fallback />}
            <div style={{ flex: 1 }}>
              <div className="ui-toast-title">{t.title}</div>
              {t.body && <div className="ui-toast-body">{t.body}</div>}
            </div>
            <button
              type="button"
              className="vsp-icon-btn"
              style={{ border: 0, background: 'transparent', width: 26, height: 26 }}
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              aria-label="Dismiss"
            >
              <Icon.x style={{ width: 15, height: 15 }} />
            </button>
          </div>
        );
      })}
    </div>,
    target,
  );
}
