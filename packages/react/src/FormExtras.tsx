import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';
import { toast } from './Toast';

export interface NumberStepperProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: ReactNode;
}

export function NumberStepper({
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: NumberStepperProps) {
  const set = (v: number) => {
    let next = v;
    if (min != null && next < min) next = min;
    if (max != null && next > max) next = max;
    onChange?.(next);
  };
  return (
    <div className="ui-stepper">
      <button
        type="button"
        onClick={() => set(value - step)}
        disabled={min != null && value <= min}
        aria-label="Decrease"
      >
        −
      </button>
      <span className="val">
        {value}
        {unit && <i>{unit}</i>}
      </span>
      <button
        type="button"
        onClick={() => set(value + step)}
        disabled={max != null && value >= max}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export function OTPInput({ length = 6, value = '', onChange }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');
  const set = (i: number, ch: string) => {
    const next = chars.slice();
    next[i] = ch.slice(-1);
    onChange?.(next.join(''));
    if (ch && i < length - 1) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !chars[i] && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <div className="ui-otp">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={c}
          onChange={(e) => set(i, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => onKey(i, e)}
        />
      ))}
    </div>
  );
}

export interface InlineEditProps {
  value?: string;
  onSave?: (value: string) => void;
  placeholder?: string;
}

export function InlineEdit({ value = '', onSave, placeholder = 'Empty' }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => {
    setEditing(false);
    if (draft !== value) onSave?.(draft);
  };
  if (editing) {
    return (
      <input
        className="ui-input"
        autoFocus
        value={draft}
        style={{ height: 32, maxWidth: 240 }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
      />
    );
  }
  return (
    <span
      className="ui-inline"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
    >
      <span style={{ color: value ? 'var(--text)' : 'var(--text-faint)' }}>
        {value || placeholder}
      </span>
      <Icon.settings className="pen" />
    </span>
  );
}

export interface CopyButtonProps {
  text: string;
  label?: ReactNode;
  size?: 'sm';
}

export function CopyButton({ text, label = 'Copy', size = 'sm' }: CopyButtonProps) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1400);
    toast({ title: 'Copied to clipboard' });
  };
  return (
    <button
      type="button"
      className={cx('btn', 'btn-ghost', size === 'sm' && 'btn-sm')}
      onClick={copy}
    >
      {done ? (
        <Icon.check style={{ width: 15, height: 15, color: 'var(--success)' }} />
      ) : (
        <Icon.doc style={{ width: 15, height: 15 }} />
      )}
      {done ? 'Copied' : label}
    </button>
  );
}

export interface FileDropzoneProps {
  hint?: ReactNode;
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
}

export function FileDropzone({
  hint = 'PNG, JPG or PDF up to 10MB',
  accept,
  multiple = true,
  onFiles,
}: FileDropzoneProps) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const take = (list: FileList | null) => {
    if (list && list.length) onFiles?.(Array.from(list));
  };
  return (
    <div
      className={cx('ui-dropzone', drag && 'drag')}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        take(e.dataTransfer.files);
      }}
    >
      <span className="dz-icon">
        <Icon.download style={{ width: 21, height: 21 }} />
      </span>
      <div style={{ fontWeight: 600, fontSize: 13.5 }}>
        Drop files or <span style={{ color: 'var(--accent)' }}>browse</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{hint}</div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => take(e.target.files)}
      />
    </div>
  );
}
