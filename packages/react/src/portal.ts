/**
 * The portal target for overlays. Overlays must render inside the nearest
 * `.vsp-root` so they inherit the theme tokens (background, text, etc.) — not
 * `document.body`, where those CSS variables are undefined.
 */
export function getPortalTarget(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector<HTMLElement>('.vsp-root') ?? document.body;
}
