import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getPortalTarget } from './portal';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

const TIP_TRANSFORM: Record<TooltipSide, string> = {
  top: 'translate(-50%,-100%)',
  bottom: 'translateX(-50%)',
  left: 'translate(-100%,-50%)',
  right: 'translateY(-50%)',
};

export interface TooltipProps {
  label: ReactNode;
  side?: TooltipSide;
  /** Delay before showing, in ms (default 0). */
  delay?: number;
  /** Suppress the tooltip entirely. */
  disabled?: boolean;
  children: ReactNode;
}

export function Tooltip({ label, children, side = 'top', delay = 0, disabled }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | null>(null);

  const place = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (side === 'bottom') setPos({ x: cx, y: r.bottom + 8 });
    else if (side === 'left') setPos({ x: r.left - 8, y: cy });
    else if (side === 'right') setPos({ x: r.right + 8, y: cy });
    else setPos({ x: cx, y: r.top - 8 });
  };

  const open = () => {
    if (disabled) return;
    place();
    if (delay > 0) timer.current = window.setTimeout(() => setShow(true), delay);
    else setShow(true);
  };
  const close = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    setShow(false);
  };

  const target = show ? getPortalTarget() : null;

  return (
    <span
      ref={ref}
      style={{ display: 'inline-flex' }}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
    >
      {children}
      {target &&
        createPortal(
          <div
            className="ui-tip"
            role="tooltip"
            style={{ left: pos.x, top: pos.y, transform: TIP_TRANSFORM[side] }}
          >
            {label}
          </div>,
          target,
        )}
    </span>
  );
}
