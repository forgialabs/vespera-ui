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
