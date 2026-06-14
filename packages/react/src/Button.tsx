import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'outline' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  /** Label shown while `loading` (keeps the button's width stable). */
  loadingText?: ReactNode;
  /** Stretch to the full width of the container. */
  fullWidth?: boolean;
}

export function Button({
  variant = 'ghost',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading,
  loadingText,
  fullWidth,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'btn',
        `btn-${variant}`,
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        fullWidth && 'btn-block',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="ui-spinner" aria-hidden /> : leadingIcon}
      {loading && loadingText != null ? loadingText : children}
      {!loading && trailingIcon}
    </button>
  );
}

export type IconButtonVariant = 'ghost' | 'subtle' | 'danger';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  /** Accessible label (also the tooltip). */
  label: string;
  dot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: IconButtonVariant;
  loading?: boolean;
}

export function IconButton({
  icon,
  label,
  dot,
  size = 'md',
  variant,
  loading,
  className,
  disabled,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'vsp-icon-btn',
        size === 'sm' && 'vsp-icon-btn-sm',
        size === 'lg' && 'vsp-icon-btn-lg',
        variant && `vsp-icon-btn-${variant}`,
        className,
      )}
      title={label}
      aria-label={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="ui-spinner" aria-hidden /> : icon}
      {dot && <span className="vsp-dot" />}
    </button>
  );
}
