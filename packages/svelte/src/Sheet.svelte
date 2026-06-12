<script>
  import { portal } from './portal.js';
  let { open = false, title, desc, icon, footer, children, onclose } = $props();
  $effect(() => {
    if (!open) return;
    const onkey = (e) => {
      if (e.key === 'Escape') onclose?.();
    };
    window.addEventListener('keydown', onkey);
    return () => window.removeEventListener('keydown', onkey);
  });
</script>

{#if open}
  <div
    class="ui-overlay"
    use:portal
    role="presentation"
    onmousedown={(e) => {
      if (e.target === e.currentTarget) onclose?.();
    }}
  >
    <div class="ui-sheet" role="dialog" aria-modal="true">
      <div class="ui-sheet-head">
        {#if icon}<span
            style="width:38px;height:38px;border-radius:var(--r-sm);display:grid;place-items:center;background:color-mix(in oklab, var(--accent) 13%, transparent);color:var(--accent);flex-shrink:0"
            >{@render icon()}</span
          >{/if}
        <div style="flex:1;min-width:0">
          <div style="font-size:16px;font-weight:700;letter-spacing:-.01em">{title}</div>
          {#if desc}<div style="font-size:12.5px;color:var(--text-dim);margin-top:3px">
              {desc}
            </div>{/if}
        </div>
        <button
          type="button"
          class="vsp-icon-btn"
          style="border:0;background:transparent;width:32px;height:32px"
          aria-label="Close"
          onclick={() => onclose?.()}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg
          >
        </button>
      </div>
      <div class="ui-sheet-body vsp-scroll">{@render children?.()}</div>
      {#if footer}<div class="ui-sheet-foot">{@render footer()}</div>{/if}
    </div>
  </div>
{/if}
