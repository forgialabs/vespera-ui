import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getPortalTarget } from './portal';
import { useEsc, useFocusTrap } from './hooks';

export type DialogTone = 'pos' | 'neg' | 'warn' | 'info';

const toneColor: Record<DialogTone, string> = {
  pos: 'var(--success)',
  neg: 'var(--danger)',
  warn: 'var(--warning)',
  info: 'var(--accent)',
};

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
  icon?: ReactNode;
  tone?: DialogTone;
  /** Close when the backdrop is clicked (default true). */
  closeOnOverlayClick?: boolean;
  /** Close when Escape is pressed (default true). */
  closeOnEsc?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  desc,
  children,
  footer,
  maxWidth = 460,
  icon,
  tone,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEsc(open && closeOnEsc, onClose);
  useFocusTrap(open, ref);
  const target = open ? getPortalTarget() : null;
  if (!target) return null;

  const color = tone ? toneColor[tone] : 'var(--accent)';

  return createPortal(
    <div
      className="ui-overlay"
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="ui-dialog"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
      >
        <div className="ui-dialog-head">
          {icon && (
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--r-sm)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 14,
                background: `color-mix(in oklab, ${color} 13%, transparent)`,
                color,
              }}
            >
              {icon}
            </span>
          )}
          <div className="ui-dialog-title">{title}</div>
          {desc && <div className="ui-dialog-desc">{desc}</div>}
        </div>
        {children && <div className="ui-dialog-body">{children}</div>}
        {footer && <div className="ui-dialog-foot">{footer}</div>}
      </div>
    </div>,
    target,
  );
}
