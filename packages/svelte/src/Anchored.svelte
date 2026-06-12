<script>
  import { portal } from './portal.js';
  let { align = 'start', width, layerClass = 'ui-menu', trigger, children } = $props();
  let open = $state(false);
  let rect = $state(null);
  let triggerEl = $state();
  let layerEl = $state();
  const place = () => {
    if (triggerEl) rect = triggerEl.getBoundingClientRect();
  };
  const close = () => (open = false);
  const toggle = () => {
    open = !open;
    if (open) requestAnimationFrame(place);
  };
  $effect(() => {
    if (!open) return;
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

{#if open && rect}
  <div bind:this={layerEl} use:portal class={layerClass} {style}>
    {@render children?.(close)}
  </div>
{/if}
