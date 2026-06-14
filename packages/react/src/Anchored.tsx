import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { getPortalTarget } from './portal';
import { cx } from './cx';

export type AnchoredAlign = 'start' | 'end';

export interface AnchoredProps {
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: AnchoredAlign;
  width?: number;
  className?: string;
  /** Controlled open state. Omit for uncontrolled (the default). */
  open?: boolean;
  /** Notified whenever the open state should change (both modes). */
  onOpenChange?: (open: boolean) => void;
}

/** Positioning base for menus and popovers: anchors a portaled layer to a trigger. */
export function Anchored({
  trigger,
  children,
  align = 'start',
  width,
  className = 'ui-menu',
  open: openProp,
  onOpenChange,
}: AnchoredProps) {
  const controlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? openProp : internalOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!layerRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const scroller = document.querySelector('.vsp-content');
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', place);
    scroller?.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', place);
      scroller?.removeEventListener('scroll', place, true);
    };
  }, [open, place]);

  let style: CSSProperties = {};
  if (rect) {
    style = { position: 'fixed', top: rect.bottom + 6, minWidth: width ?? rect.width, zIndex: 320 };
    if (align === 'end') style.right = window.innerWidth - rect.right;
    else style.left = rect.left;
  }

  const target = open && rect ? getPortalTarget() : null;

  return (
    <>
      <span ref={triggerRef} onClick={() => setOpen(!open)} style={{ display: 'inline-flex' }}>
        {trigger}
      </span>
      {target &&
        createPortal(
          <div ref={layerRef} className={className} style={style}>
            {typeof children === 'function' ? children(() => setOpen(false)) : children}
          </div>,
          target,
        )}
    </>
  );
}

export interface MenuItem {
  label?: ReactNode;
  icon?: ReactNode;
  kbd?: ReactNode;
  danger?: boolean;
  heading?: boolean;
  sep?: boolean;
  onClick?: () => void;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  align?: AnchoredAlign;
  width?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({
  trigger,
  items,
  align = 'end',
  width,
  open,
  onOpenChange,
}: DropdownMenuProps) {
  return (
    <Anchored trigger={trigger} align={align} width={width} open={open} onOpenChange={onOpenChange}>
      {(close) =>
        items.map((it, i) => {
          if (it.sep) return <div key={i} className="ui-menu-sep" />;
          if (it.heading)
            return (
              <div key={i} className="ui-menu-label">
                {it.label}
              </div>
            );
          return (
            <button
              key={i}
              type="button"
              className={cx('ui-menu-item', it.danger && 'danger')}
              onClick={() => {
                it.onClick?.();
                close();
              }}
            >
              {it.icon}
              {it.label}
              {it.kbd && <kbd className="ui-kbd">{it.kbd}</kbd>}
            </button>
          );
        })
      }
    </Anchored>
  );
}

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: AnchoredAlign;
  width?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  trigger,
  children,
  align = 'start',
  width = 260,
  open,
  onOpenChange,
}: PopoverProps) {
  return (
    <Anchored
      trigger={trigger}
      align={align}
      width={width}
      className="ui-popover"
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </Anchored>
  );
}
