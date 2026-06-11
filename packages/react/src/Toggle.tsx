import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@vespera-ui/icons';
import { cx } from './cx';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  sub?: ReactNode;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, sub, disabled }: CheckboxProps) {
  const toggle = () => {
    if (!disabled) onChange?.(!checked);
  };
  const node = (
    <span className={cx('ui-check', checked && 'on')}>
      <Icon.check />
    </span>
  );
  if (!label) {
    return (
      <span onClick={toggle} style={{ display: 'inline-flex', opacity: disabled ? 0.5 : 1 }}>
        {node}
      </span>
    );
  }
  return (
    <label
      className="ui-opt"
      style={{ opacity: disabled ? 0.5 : 1 }}
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
    >
      {node}
      <span>
        <span>{label}</span>
        {sub && <span className="ui-opt-sub">{sub}</span>}
      </span>
    </label>
  );
}

export interface RadioProps {
  checked?: boolean;
  onChange?: () => void;
  label?: ReactNode;
  sub?: ReactNode;
}

export function Radio({ checked, onChange, label, sub }: RadioProps) {
  return (
    <label
      className="ui-opt"
      onClick={(e) => {
        e.preventDefault();
        onChange?.();
      }}
    >
      <span className={cx('ui-radio-dot', checked && 'on')} />
      <span>
        <span>{label}</span>
        {sub && <span className="ui-opt-sub">{sub}</span>}
      </span>
    </label>
  );
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  sub?: ReactNode;
}

export interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  style?: CSSProperties;
}

export function RadioGroup({ value, onChange, options, style }: RadioGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
      {options.map((o) => (
        <Radio
          key={o.value}
          label={o.label}
          sub={o.sub}
          checked={value === o.value}
          onChange={() => onChange(o.value)}
        />
      ))}
    </div>
  );
}

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm';
  disabled?: boolean;
  'aria-label'?: string;
}

export function Switch({ checked, onChange, size, disabled, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx('ui-switch', size === 'sm' && 'sm', checked && 'on')}
      onClick={() => onChange?.(!checked)}
      aria-pressed={checked}
      {...rest}
    />
  );
}

export interface SliderProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1 }: SliderProps) {
  return (
    <input
      type="range"
      className="ui-slider"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange?.(Number(e.target.value))}
    />
  );
}
