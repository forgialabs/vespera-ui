// Move an element to the nearest .vsp-root so overlays inherit the theme tokens.
export function portal(node) {
  const target = document.querySelector('.vsp-root') ?? document.body;
  target.appendChild(node);
  return {
    destroy() {
      node.parentNode?.removeChild(node);
    },
  };
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Action: trap Tab focus inside `node`, focus the first focusable on mount, and
// restore focus to the previously-focused element on destroy. The node should
// carry tabindex="-1" so it can take focus when empty.
export function focusTrap(node) {
  const prev = document.activeElement;
  const list = () =>
    Array.from(node.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0,
    );
  const id = setTimeout(() => (list()[0] ?? node).focus(), 0);
  const onKey = (e) => {
    if (e.key !== 'Tab') return;
    const els = list();
    if (!els.length) {
      e.preventDefault();
      return;
    }
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  node.addEventListener('keydown', onKey);
  return {
    destroy() {
      clearTimeout(id);
      node.removeEventListener('keydown', onKey);
      prev?.focus?.();
    },
  };
}
