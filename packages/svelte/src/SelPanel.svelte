<script>
  import { portal } from './portal.js';

  let { open = false, anchor = null, width = undefined, onclose, children } = $props();

  let rect = $state(null);
  let panelEl = $state();

  const place = () => {
    if (anchor) rect = anchor.getBoundingClientRect();
  };

  $effect(() => {
    if (!open) {
      rect = null;
      return;
    }
    place();
    const onDoc = (e) => {
      const t = e.target;
      if (!panelEl?.contains(t) && !anchor?.contains(t)) onclose?.();
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') onclose?.();
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onEsc);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  });
</script>

{#if open && rect}
  <div
    bind:this={panelEl}
    class="ui-menu ui-combo"
    use:portal
    style="position:fixed;top:{rect.bottom + 6}px;left:{rect.left}px;width:{width ??
      rect.width}px;z-index:330;max-height:{Math.max(220, window.innerHeight - rect.bottom - 16)}px"
  >
    {@render children?.()}
  </div>
{/if}
