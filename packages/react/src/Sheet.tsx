import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@vespera-ui/icons';
import { getPortalTarget } from './portal';
import { useEsc } from './hooks';

export interface SheetProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
}

export function Sheet({ open, onClose, title, desc, children, footer, icon }: SheetProps) {
  useEsc(open, onClose);
  const target = open ? getPortalTarget() : null;
  if (!target) return null;

  return createPortal(
    <div
      className="ui-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="ui-sheet" role="dialog" aria-modal="true">
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
