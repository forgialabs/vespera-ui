// Roving arrow-key focus between sibling menu items (one level).
export function menuNav(e) {
  const k = e.key;
  if (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End') return;
  e.preventDefault();
  const parent = e.currentTarget.parentElement;
  if (!parent) return;
  const els = Array.from(parent.querySelectorAll(':scope > [role^="menuitem"]:not([disabled])'));
  const i = els.indexOf(e.currentTarget);
  const n = els.length;
  const next =
    k === 'Home'
      ? els[0]
      : k === 'End'
        ? els[n - 1]
        : k === 'ArrowDown'
          ? els[(i + 1) % n]
          : els[(i - 1 + n) % n];
  next?.focus();
}
