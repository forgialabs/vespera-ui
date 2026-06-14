import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@vespera-ui/icons';
import { getPortalTarget } from './portal';
import { useEsc, useFocusTrap } from './hooks';

export type SheetSide = 'right' | 'left' | 'top' | 'bottom';

export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  /** Which edge the sheet slides in from (default 'right'). */
  side?: SheetSide;
  /** Close when the backdrop is clicked (default true). */
  closeOnOverlayClick?: boolean;
  /** Close when Escape is pressed (default true). */
  closeOnEsc?: boolean;
}

export function Sheet({
  open,
  onClose,
  title,
  desc,
  children,
  footer,
  icon,
  side = 'right',
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEsc(open && closeOnEsc, onClose);
  useFocusTrap(open, ref);
  const target = open ? getPortalTarget() : null;
  if (!target) return null;

  return createPortal(
    <div
      className="ui-overlay"
      data-sheet-side={side}
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="ui-sheet"
        data-side={side}
        role="dialog"
        aria-modal="true"
      >
        <div className="ui-sheet-head">
          {icon && (
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--r-sm)',
                display: 'grid',
                placeItems: 'center',
                background: 'color-mix(in oklab, var(--accent) 13%, transparent)',
                color: 'var(--accent)',
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>{title}</div>
            {desc && (
              <div style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: 3 }}>{desc}</div>
            )}
          </div>
          <button
            type="button"
            className="vsp-icon-btn"
            style={{ border: 0, background: 'transparent', width: 32, height: 32 }}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon.x />
          </button>
        </div>
        <div className="ui-sheet-body vsp-scroll">{children}</div>
        {footer && <div className="ui-sheet-foot">{footer}</div>}
      </div>
    </div>,
    target,
  );
}
