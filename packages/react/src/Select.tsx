import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@vespera-ui/icons';
import { getPortalTarget } from './portal';
import { cx } from './cx';

export type SelectValue = string | number;

export interface SelectOption {
  value: SelectValue;
  label: string;
  /** Optional color swatch shown before the label. */
  swatch?: string;
}

export type SelectOptionInput = SelectValue | SelectOption;

function normalizeOption(o: SelectOptionInput): SelectOption {
  return typeof o === 'object' ? o : { value: o, label: String(o) };
}

/* ---------------- anchored dropdown panel ---------------- */

interface SelPanelProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  width?: number;
  children?: ReactNode;
}

function SelPanel({ open, anchorRef, onClose, width, children }: SelPanelProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (open && anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
    };
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t) && !anchorRef.current?.contains(t)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open, anchorRef, onClose]);

  if (!open || !rect) return null;
  const target = getPortalTarget();
  if (!target) return null;

  const maxBelow = window.innerHeight - rect.bottom - 16;
  return createPortal(
    <div
      ref={ref}
      className="ui-menu ui-combo"
      style={{
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        width: width ?? rect.width,
        zIndex: 330,
        maxHeight: Math.max(220, maxBelow),
      }}
    >
      {children}
    </div>,
    target,
  );
}

/* ---------------- search + list ---------------- */

interface ComboListProps {
  q: string;
  setQ: (q: string) => void;
  items: SelectOption[];
  onPick: (o: SelectOption) => void;
  activeIdx: number;
  setActiveIdx: Dispatch<SetStateAction<number>>;
  isSel: (o: SelectOption) => boolean;
  searchPlaceholder?: string;
  footer?: ReactNode;
}

function ComboList({
  q,
  setQ,
  items,
  onPick,
  activeIdx,
  setActiveIdx,
  isSel,
  searchPlaceholder,
  footer,
}: ComboListProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, []);

  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = items[activeIdx];
      if (it) onPick(it);
    }
  };

  return (
    <>
      <div className="ui-combo-search">
        <Icon.search />
        <input
          ref={inputRef}
          value={q}
          placeholder={searchPlaceholder ?? 'Search…'}
          onChange={(e) => {
            setQ(e.target.value);
            setActiveIdx(0);
          }}
          onKeyDown={onKey}
        />
      </div>
      <div className="ui-combo-list">
        {items.length === 0 && <div className="ui-combo-empty">No matches for “{q}”</div>}
        {items.map((o, i) => (
          <div
            key={String(o.value)}
            className={cx('ui-combo-item', i === activeIdx && 'active')}
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => onPick(o)}
          >
            {o.swatch && (
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 3,
                  background: o.swatch,
                  flexShrink: 0,
                }}
              />
            )}
            <span>{o.label}</span>
            {isSel(o) && <Icon.check className="tick" />}
          </div>
        ))}
      </div>
      {footer}
    </>
  );
}

/* ---------------- Select (themed drop-in, auto-searches at ≥8 options) ---------------- */

export interface SelectProps {
  options: SelectOptionInput[];
  value?: SelectValue;
  defaultValue?: SelectValue;
  onChange?: (value: SelectValue) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  /** Force the search box on/off (defaults to on at ≥8 options). */
  searchable?: boolean;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select…',
  className,
  style,
  disabled,
  searchable,
}: SelectProps) {
  const opts = options.map(normalizeOption);
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<SelectValue | undefined>(defaultValue);
  const cur = controlled ? value : (internal ?? opts[0]?.value);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const anchor = useRef<HTMLButtonElement>(null);

  const sel = opts.find((o) => String(o.value) === String(cur));
  const useSearch = searchable ?? opts.length >= 8;
  const items = useSearch
    ? opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
    : opts;

  const choose = (o: SelectOption) => {
    if (!controlled) setInternal(o.value);
    onChange?.(o.value);
    setOpen(false);
    setQ('');
  };

  return (
    <>
      <button
        type="button"
        ref={anchor}
        disabled={disabled}
        className={cx('ui-selectbtn', open && 'open', className)}
        style={style}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={cx('val', !sel && 'ph')}>{sel ? sel.label : placeholder}</span>
      </button>
      <SelPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        {useSearch ? (
          <ComboList
            q={q}
            setQ={setQ}
            items={items}
            activeIdx={active}
            setActiveIdx={setActive}
            onPick={choose}
            isSel={(o) => String(o.value) === String(cur)}
          />
        ) : (
          <div className="ui-combo-list">
            {items.length === 0 ? (
              <div className="ui-combo-empty">No options</div>
            ) : (
              items.map((o) => (
                <div
                  key={String(o.value)}
                  className={cx('ui-combo-item', String(o.value) === String(cur) && 'active')}
                  onClick={() => choose(o)}
                >
                  {o.swatch && (
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 3,
                        background: o.swatch,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span>{o.label}</span>
                  {String(o.value) === String(cur) && <Icon.check className="tick" />}
                </div>
              ))
            )}
          </div>
        )}
      </SelPanel>
    </>
  );
}

/* ---------------- Combobox (searchable single select) ---------------- */

export interface ComboboxProps {
  options: SelectOptionInput[];
  value?: SelectValue | null;
  onChange?: (value: SelectValue | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  clearable?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder,
  clearable,
}: ComboboxProps) {
  const opts = options.map(normalizeOption);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const anchor = useRef<HTMLButtonElement>(null);

  const sel = opts.find((o) => o.value === value);
  const items = opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const pick = (o: SelectOption) => {
    onChange?.(o.value);
    setOpen(false);
    setQ('');
  };

  return (
    <>
      <button
        type="button"
        ref={anchor}
        className={cx('ui-trigger', open && 'open')}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={cx('val', !sel && 'ph')}>{sel ? sel.label : placeholder}</span>
        {clearable && sel && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
            }}
            style={{ display: 'grid', placeItems: 'center', color: 'var(--text-faint)' }}
          >
            <Icon.x style={{ width: 14, height: 14 }} />
          </span>
        )}
        <Icon.chevDown className="chev" />
      </button>
      <SelPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        <ComboList
          q={q}
          setQ={setQ}
          items={items}
          activeIdx={active}
          setActiveIdx={setActive}
          onPick={pick}
          isSel={(o) => o.value === value}
          searchPlaceholder={searchPlaceholder}
        />
      </SelPanel>
    </>
  );
}

/* ---------------- MultiSelect (searchable, tagged) ---------------- */

export interface MultiSelectProps {
  options: SelectOptionInput[];
  value?: SelectValue[];
  onChange?: (value: SelectValue[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  max?: number;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select…',
  searchPlaceholder,
  max,
}: MultiSelectProps) {
  const opts = options.map(normalizeOption);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const anchor = useRef<HTMLDivElement>(null);

  const items = opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const has = (v: SelectValue) => value.includes(v);
  const toggle = (o: SelectOption) => {
    if (has(o.value)) onChange?.(value.filter((v) => v !== o.value));
    else if (!max || value.length < max) onChange?.([...value, o.value]);
  };
  const selOpts = opts.filter((o) => has(o.value));

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        ref={anchor}
        className={cx('ui-trigger', open && 'open')}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        style={{ minHeight: 'var(--ctrl-h)' }}
      >
        {selOpts.length === 0 ? (
          <span className="val ph">{placeholder}</span>
        ) : (
          <span className="tags">
            {selOpts.map((o) => (
              <span key={String(o.value)} className="ui-tag" onClick={(e) => e.stopPropagation()}>
                {o.label}
                <button
                  type="button"
                  onClick={() => onChange?.(value.filter((v) => v !== o.value))}
                  aria-label={`Remove ${o.label}`}
                >
                  <Icon.x style={{ width: 11, height: 11 }} />
                </button>
              </span>
            ))}
          </span>
        )}
        <Icon.chevDown className="chev" />
      </div>
      <SelPanel open={open} anchorRef={anchor} onClose={() => setOpen(false)}>
        <ComboList
          q={q}
          setQ={setQ}
          items={items}
          activeIdx={active}
          setActiveIdx={setActive}
          onPick={toggle}
          isSel={(o) => has(o.value)}
          searchPlaceholder={searchPlaceholder}
          footer={
            <div className="ui-combo-foot">
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                {value.length} selected{max ? ` / ${max}` : ''}
              </span>
              <div style={{ flex: 1 }} />
              {value.length > 0 && (
                <button
                  type="button"
                  className="btn btn-subtle btn-sm"
                  onClick={() => onChange?.([])}
                >
                  Clear
                </button>
              )}
            </div>
          }
        />
      </SelPanel>
    </>
  );
}

/* ---------------- TokenInput (creatable tags) ---------------- */

export interface TokenInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

export function TokenInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter…',
}: TokenInputProps) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange?.([...value, t]);
    setDraft('');
  };
  const onKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange?.(value.slice(0, -1));
    }
  };
  return (
    <div
      className="ui-trigger"
      style={{
        cursor: 'text',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
        paddingTop: 5,
        paddingBottom: 5,
      }}
      onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
    >
      {value.map((t) => (
        <span key={t} className="ui-tag" style={{ maxWidth: '100%' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {t}
          </span>
          <button
            type="button"
            onClick={() => onChange?.(value.filter((v) => v !== t))}
            aria-label={`Remove ${t}`}
          >
            <Icon.x style={{ width: 11, height: 11 }} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={value.length ? '' : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        style={{
          flex: '1 1 80px',
          minWidth: 80,
          border: 0,
          background: 'transparent',
          outline: 'none',
          font: 'inherit',
          fontSize: 13.5,
          color: 'var(--text)',
        }}
      />
    </div>
  );
}
