import { useEffect, type Dispatch, type SetStateAction } from 'react';

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
