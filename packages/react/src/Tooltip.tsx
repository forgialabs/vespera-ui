import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getPortalTarget } from './portal';

export interface TooltipProps {
  label: ReactNode;
  side?: 'top' | 'bottom';
  children: ReactNode;
}

export function Tooltip({ label, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const place = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: r.left + r.width / 2,
      y: side === 'bottom' ? r.bottom + 8 : r.top - 8,
    });
  };

  const target = show ? getPortalTarget() : null;

  return (
    <span
      ref={ref}
      style={{ display: 'inline-flex' }}
      onMouseEnter={() => {
        place();
        setShow(true);
      }}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {target &&
        createPortal(
          <div
            className="ui-tip"
            style={{
              left: pos.x,
              top: pos.y,
              transform: side === 'bottom' ? 'translateX(-50%)' : 'translate(-50%,-100%)',
            }}
          >
            {label}
          </div>,
          target,
        )}
    </span>
  );
}
