import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@vespera-ui/icons';
import { getPortalTarget } from './portal';
import { useEsc } from './hooks';
import { cx } from './cx';

export interface CommandItem {
  label: ReactNode;
  meta?: ReactNode;
  keywords?: string;
  icon?: ReactNode;
  onRun?: () => void;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  groups: CommandGroup[];
}

type FlatItem = CommandItem & { group: string; idx: number };

const haystack = (it: CommandItem): string =>
  [
    typeof it.label === 'string' ? it.label : '',
    it.keywords ?? '',
    typeof it.meta === 'string' ? it.meta : '',
  ]
    .join(' ')
    .toLowerCase();

export function CommandPalette({ open, onClose, groups }: CommandPaletteProps) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEsc(open, onClose);

  useEffect(() => {
    if (!open) return;
    setQ('');
    setActive(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [open]);

  const query = q.toLowerCase();
  const flat: FlatItem[] = [];
  groups.forEach((g) => {
    g.items.forEach((it) => {
      if (!query || haystack(it).includes(query)) {
        flat.push({ ...it, group: g.label, idx: flat.length });
      }
    });
  });

  const groupOrder: string[] = [];
  const byGroup = new Map<string, FlatItem[]>();
  flat.forEach((it) => {
    let bucket = byGroup.get(it.group);
    if (!bucket) {
      bucket = [];
      byGroup.set(it.group, bucket);
      groupOrder.push(it.group);
    }
    bucket.push(it);
  });

  const run = (it: FlatItem | undefined) => {
    it?.onRun?.();
    onClose?.();
  };

  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(flat[active]);
    }
  };

  const target = open ? getPortalTarget() : null;
  if (!target) return null;

  return createPortal(
    <div
      className="ui-overlay ui-cmd-wrap"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="ui-cmd" role="dialog" aria-modal="true">
        <div className="ui-cmd-input">
          <Icon.search />
          <input
            ref={inputRef}
            value={q}
            placeholder="Type a command or search…"
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
          />
          <kbd className="ui-kbd">ESC</kbd>
        </div>
        <div className="ui-cmd-list vsp-scroll">
          {flat.length === 0 && (
            <div
              style={{
                padding: '28px 12px',
                textAlign: 'center',
                color: 'var(--text-faint)',
                fontSize: 13,
              }}
            >
              No results for “{q}”
            </div>
          )}
          {groupOrder.map((g) => (
            <div key={g}>
              <div className="ui-cmd-group">{g}</div>
              {(byGroup.get(g) ?? []).map((it) => (
                <div
                  key={it.idx}
                  className={cx('ui-cmd-item', it.idx === active && 'active')}
                  onMouseEnter={() => setActive(it.idx)}
                  onClick={() => run(it)}
                >
                  {it.icon}
                  <span>{it.label}</span>
                  {it.meta && <span className="ui-cmd-meta">{it.meta}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="ui-cmd-foot">
          <span className="k">
            <kbd className="ui-kbd">↑</kbd>
            <kbd className="ui-kbd">↓</kbd> navigate
          </span>
          <span className="k">
            <kbd className="ui-kbd">↵</kbd> select
          </span>
          <span className="k" style={{ marginLeft: 'auto' }}>
            Vespera Command
          </span>
        </div>
      </div>
    </div>,
    target,
  );
}
