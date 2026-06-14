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
  let style = $derived.by(() => {
    if (!rect) return '';
    let s = `position:fixed;top:${rect.bottom + 6}px;min-width:${width ?? rect.width}px;z-index:320;`;
    s += align === 'end' ? `right:${window.innerWidth - rect.right}px` : `left:${rect.left}px`;
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
