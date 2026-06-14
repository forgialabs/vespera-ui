import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react';

/** Call `onClose` when Escape is pressed while `open`. */
export function useEsc(open: boolean, onClose?: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * While `open`, trap Tab focus inside `ref`, focus the first focusable on open,
 * and restore focus to the previously-focused element on close. The container
 * should carry `tabIndex={-1}` so it can receive focus when it has no children.
 */
export function useFocusTrap(open: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;
    const prev = document.activeElement as HTMLElement | null;
    const list = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
      );
    const id = window.setTimeout(() => (list()[0] ?? node).focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = list();
      if (!els.length) {
        e.preventDefault();
        return;
      }
      const first = els[0]!;
      const last = els[els.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(id);
      node.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, ref]);
}

/** Toggle a boolean (e.g. a command palette) with ⌘K / Ctrl+K. */
export function useCmdK(setOpen: Dispatch<SetStateAction<boolean>>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setOpen]);
}
