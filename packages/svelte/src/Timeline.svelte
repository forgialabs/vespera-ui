<script>
  let { items = [] } = $props();
  const TONE = {
    pos: 'var(--success)',
    neg: 'var(--danger)',
    warn: 'var(--warning)',
    info: 'var(--accent)',
  };
</script>

<div class="ui-tl">
  {#each items as it, i (i)}
    {@const c = it.tone ? TONE[it.tone] : undefined}
    <div class="ui-tl-item{it.active ? ' active' : ''}">
      <span
        class="ui-tl-dot"
        style={c
          ? `background:color-mix(in oklab, ${c} 14%, transparent);color:${c};border-color:color-mix(in oklab, ${c} 30%, transparent)`
          : ''}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg
        >
      </span>
      <div class="ui-tl-body">
        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
          <span style="font-weight:600;font-size:13.5px">{it.title}</span>
          {#if it.time}<span class="eyebrow" style="margin-left:auto">{it.time}</span>{/if}
        </div>
        {#if it.body}<div style="font-size:12.5px;color:var(--text-dim);margin-top:3px">
            {it.body}
          </div>{/if}
      </div>
    </div>
  {/each}
</div>
