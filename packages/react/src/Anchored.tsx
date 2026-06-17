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
import { Icon } from '@vespera-ui/icons';
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
  const [layerSize, setLayerSize] = useState<{ w: number; h: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  // Measure the layer so it can be flipped/clamped to stay inside the viewport.
  useLayoutEffect(() => {
    if (!open) {
      setLayerSize(null);
      return;
    }
    if (!layerRef.current) return;
    // offsetWidth/Height = untransformed layout box, so the open animation
    // (scale 0.98) doesn't skew the measurement.
    const w = layerRef.current.offsetWidth;
    const h = layerRef.current.offsetHeight;
    setLayerSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
  }, [open, rect]);

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

  const MARGIN = 8;
  let style: CSSProperties = {};
  if (rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const lw = layerSize?.w ?? width ?? rect.width;
    const lh = layerSize?.h ?? 0;
    // Prefer opening below the trigger; flip above when there's no room below.
    let top = rect.bottom + 6;
    if (lh && top + lh > vh - MARGIN && rect.top - 6 - lh >= MARGIN) {
      top = rect.top - 6 - lh;
    }
    // Align to the trigger's start/end edge, then clamp into the viewport.
    let left = align === 'end' ? rect.right - lw : rect.left;
    left = Math.max(MARGIN, Math.min(left, vw - MARGIN - lw));
    if (lh) top = Math.max(MARGIN, Math.min(top, vh - MARGIN - lh));
    style = {
      position: 'fixed',
      top,
      left,
      minWidth: width ?? rect.width,
      maxHeight: `calc(100vh - ${MARGIN * 2}px)`,
      overflowY: 'auto',
      zIndex: 320,
      // Hide for the first paint until measured, so it never flashes off-screen.
      visibility: layerSize ? undefined : 'hidden',
    };
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
  disabled?: boolean;
  /** Render as a checkable item — shows a tick and keeps the menu open on select. */
  type?: 'checkbox' | 'radio';
  checked?: boolean;
  /** Nested items — renders a submenu that flies out to the side. */
  items?: MenuItem[];
  onClick?: () => void;
}

/** Roving arrow-key focus between menu items. */
function onMenuKey(e: import('react').KeyboardEvent<HTMLButtonElement>) {
  const key = e.key;
  if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return;
  e.preventDefault();
  const parent = e.currentTarget.parentElement;
  if (!parent) return;
  const items = Array.from(
    parent.querySelectorAll<HTMLButtonElement>(':scope > [role^="menuitem"]:not([disabled])'),
  );
  const i = items.indexOf(e.currentTarget);
  const next =
    key === 'Home'
      ? items[0]
      : key === 'End'
        ? items[items.length - 1]
        : key === 'ArrowDown'
          ? items[(i + 1) % items.length]
          : items[(i - 1 + items.length) % items.length];
  next?.focus();
}

/** A parent item that opens a nested flyout menu on hover / ArrowRight. */
function SubMenuItem({ item, close }: { item: MenuItem; close: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const timer = useRef<number | null>(null);
  const cancel = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const openNow = () => {
    cancel();
    if (ref.current) setRect(ref.current.getBoundingClientRect());
    setOpen(true);
  };
  const closeSoon = () => {
    cancel();
    timer.current = window.setTimeout(() => setOpen(false), 130);
  };
  const target = open && rect ? getPortalTarget() : null;
  return (
    <>
      <button
        ref={ref}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={item.disabled}
        className={cx('ui-menu-item', 'ui-menu-parent', item.danger && 'danger')}
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
        onClick={openNow}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            openNow();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setOpen(false);
          } else onMenuKey(e);
        }}
      >
        {item.icon}
        {item.label}
        <Icon.chevRight className="ui-menu-sub-arrow" />
      </button>
      {target &&
        createPortal(
          <div
            className="ui-menu"
            role="menu"
            style={{ position: 'fixed', left: rect!.right - 4, top: rect!.top - 6, zIndex: 340 }}
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
          >
            <MenuList items={item.items!} close={close} />
          </div>,
          target,
        )}
    </>
  );
}

function MenuList({ items, close }: { items: MenuItem[]; close: () => void }) {
  return (
    <>
      {items.map((it, i) => {
        if (it.sep) return <div key={i} className="ui-menu-sep" />;
        if (it.heading)
          return (
            <div key={i} className="ui-menu-label">
              {it.label}
            </div>
          );
        if (it.items && it.items.length) return <SubMenuItem key={i} item={it} close={close} />;
        const role =
          it.type === 'checkbox'
            ? 'menuitemcheckbox'
            : it.type === 'radio'
              ? 'menuitemradio'
              : 'menuitem';
        return (
          <button
            key={i}
            type="button"
            role={role}
            disabled={it.disabled}
            aria-checked={it.type ? !!it.checked : undefined}
            className={cx('ui-menu-item', it.danger && 'danger')}
            onClick={() => {
              it.onClick?.();
              if (!it.type) close();
            }}
            onKeyDown={onMenuKey}
          >
            {it.type ? (
              <span className="ui-menu-check">{it.checked && <Icon.check />}</span>
            ) : (
              it.icon
            )}
            {it.label}
            {it.kbd && <kbd className="ui-kbd">{it.kbd}</kbd>}
          </button>
        );
      })}
    </>
  );
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
      {(close) => <MenuList items={items} close={close} />}
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
