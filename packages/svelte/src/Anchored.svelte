<script>
  import { portal } from './portal.js';
  let {
    align = 'start',
    width,
    layerClass = 'ui-menu',
    open = undefined,
    onOpenChange,
    trigger,
    children,
  } = $props();
  let internalOpen = $state(false);
  let isOpen = $derived(open !== undefined ? open : internalOpen);
  let rect = $state(null);
  let layerSize = $state(null);
  let triggerEl = $state();
  let layerEl = $state();
  const place = () => {
    if (triggerEl) rect = triggerEl.getBoundingClientRect();
  };
  const setOpen = (next) => {
    if (open === undefined) internalOpen = next;
    onOpenChange?.(next);
  };
  const close = () => setOpen(false);
  const toggle = () => {
    const next = !isOpen;
    setOpen(next);
    if (next) requestAnimationFrame(place);
  };
  $effect(() => {
    if (!isOpen) return;
    place();
    const onDoc = (e) => {
      if (!layerEl?.contains(e.target) && !triggerEl?.contains(e.target)) close();
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', place);
    };
  });
  // Measure the layer so it can be flipped/clamped to stay inside the viewport.
  $effect(() => {
    if (isOpen && layerEl && rect) {
      // offsetWidth/Height = untransformed layout box (open animation safe).
      layerSize = { w: layerEl.offsetWidth, h: layerEl.offsetHeight };
    } else if (!isOpen) {
      layerSize = null;
    }
  });
  let style = $derived.by(() => {
    if (!rect) return '';
    const MARGIN = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const lw = layerSize?.w ?? width ?? rect.width;
    const lh = layerSize?.h ?? 0;
    let top = rect.bottom + 6;
    if (lh && top + lh > vh - MARGIN && rect.top - 6 - lh >= MARGIN) top = rect.top - 6 - lh;
    let left = align === 'end' ? rect.right - lw : rect.left;
    left = Math.max(MARGIN, Math.min(left, vw - MARGIN - lw));
    if (lh) top = Math.max(MARGIN, Math.min(top, vh - MARGIN - lh));
    let s = `position:fixed;top:${top}px;left:${left}px;min-width:${width ?? rect.width}px;max-height:calc(100vh - ${MARGIN * 2}px);overflow-y:auto;z-index:320;`;
    if (!layerSize) s += 'visibility:hidden;';
    return s;
  });
</script>

<span
  bind:this={triggerEl}
  role="button"
  tabindex="0"
  onclick={toggle}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') toggle();
  }}
  style="display:inline-flex">{@render trigger?.()}</span
>

{#if isOpen && rect}
  <div bind:this={layerEl} use:portal class={layerClass} {style}>
    {@render children?.(close)}
  </div>
{/if}
