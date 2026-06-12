<script>
  import { portal } from './portal.js';
  let { open = false, title, desc, maxWidth = 460, tone, icon, footer, children, onclose } = $props();
  const TONE = {
    pos: 'var(--success)',
    neg: 'var(--danger)',
    warn: 'var(--warning)',
    info: 'var(--accent)',
  };
  let color = $derived(tone ? TONE[tone] : 'var(--accent)');
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
    <div class="ui-dialog" style="max-width:{maxWidth}px" role="dialog" aria-modal="true">
      <div class="ui-dialog-head">
        {#if icon}<span
            style="width:42px;height:42px;border-radius:var(--r-sm);display:grid;place-items:center;margin-bottom:14px;background:color-mix(in oklab, {color} 13%, transparent);color:{color}"
            >{@render icon()}</span
          >{/if}
        <div class="ui-dialog-title">{title}</div>
        {#if desc}<div class="ui-dialog-desc">{desc}</div>{/if}
      </div>
      {#if children}<div class="ui-dialog-body">{@render children()}</div>{/if}
      {#if footer}<div class="ui-dialog-foot">{@render footer()}</div>{/if}
    </div>
  </div>
{/if}
