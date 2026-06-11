import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cx } from './cx';

export interface FieldProps {
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function Field({ label, required, hint, error, children, htmlFor, action }: FieldProps) {
  return (
    <div className="ui-field">
      {label && (
        <label className="ui-label" htmlFor={htmlFor}>
          <span>
            {label}
            {required && <span className="req"> *</span>}
          </span>
          {action}
        </label>
      )}
      {children}
      {(error || hint) && <span className={cx('ui-hint', error && 'err')}>{error || hint}</span>}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...rest }: InputProps) {
  return <input className={cx('ui-input', invalid && 'invalid', className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('ui-textarea', className)} {...rest} />;
}

export type SelectOption = string | { value: string; label: string };

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
}

/** Native themed `<select>`. (A custom searchable Select ships later.) */
export function Select({ options = [], className, children, ...rest }: SelectProps) {
  return (
    <select className={cx('ui-select', className)} {...rest}>
      {children ??
        options.map((o) =>
          typeof o === 'string' ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
    </select>
  );
}

export interface InputAffixProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  leadingIcon?: ReactNode;
  prefix?: ReactNode;
  unit?: ReactNode;
  wrapClassName?: string;
}

export function InputAffix({ leadingIcon, prefix, unit, wrapClassName, ...rest }: InputAffixProps) {
  return (
    <div className={cx('ui-affix', wrapClassName)}>
      {leadingIcon}
      {prefix && <span className="unit">{prefix}</span>}
      <input {...rest} />
      {unit && <span className="unit">{unit}</span>}
    </div>
  );
}
