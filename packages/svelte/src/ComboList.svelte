<script>
  let {
    q = '',
    items = [],
    activeIdx = 0,
    isSel = () => false,
    searchPlaceholder = undefined,
    loading = false,
    emptyText = undefined,
    onq,
    onactive,
    onpick,
    footer,
  } = $props();

  let inputEl = $state();

  $effect(() => {
    const id = setTimeout(() => inputEl?.focus(), 30);
    return () => clearTimeout(id);
  });

  function onKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      onactive?.(Math.min(items.length - 1, activeIdx + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onactive?.(Math.max(0, activeIdx - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = items[activeIdx];
      if (it) onpick?.(it);
    }
  }
</script>

<div class="ui-combo-search">
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
  <input
    bind:this={inputEl}
    value={q}
    placeholder={searchPlaceholder ?? 'Search…'}
    oninput={(e) => {
      onq?.(e.target.value);
      onactive?.(0);
    }}
    onkeydown={onKey}
  />
</div>
<div class="ui-combo-list">
  {#if loading}
    <div class="ui-combo-loading"><span class="ui-spinner" aria-hidden="true"></span> Loading…</div>
  {:else if items.length === 0}
    <div class="ui-combo-empty">{emptyText ?? `No matches for “${q}”`}</div>
  {/if}
  {#each loading ? [] : items as o, i (String(o.value))}
    <div
      class="ui-combo-item {i === activeIdx ? 'active' : ''}"
      role="option"
      aria-selected={i === activeIdx}
      tabindex="-1"
      onmouseenter={() => onactive?.(i)}
      onclick={() => onpick?.(o)}
      onkeydown={(e) => e.key === 'Enter' && onpick?.(o)}
    >
      {#if o.swatch}
        <span style="width:9px;height:9px;border-radius:3px;background:{o.swatch};flex-shrink:0"></span>
      {/if}
      <span>{o.label}</span>
      {#if isSel(o)}
        <svg
          class="tick"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
        >
      {/if}
    </div>
  {/each}
</div>
{@render footer?.()}
