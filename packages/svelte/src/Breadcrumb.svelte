<script>
  let { items = [], maxItems = undefined } = $props();
  const ELL = { ellipsis: true };
  let display = $derived(
    maxItems && items.length > maxItems
      ? [items[0], ELL, ...items.slice(items.length - (maxItems - 1))]
      : items,
  );
  const lbl = (it) => (typeof it === 'object' && it ? it.label : it);
</script>

<nav aria-label="Breadcrumb" style="display:flex;align-items:center;gap:7px;font-size:12.5px">
  {#each display as it, i}
    {@const last = i === display.length - 1}
    {#if i > 0}
      <svg
        viewBox="0 0 24 24"
        width="13"
        height="13"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="color:var(--text-faint)"><path d="M9 18l6-6-6-6" /></svg
      >
    {/if}
    {#if it === ELL}
      <span style="color:var(--text-faint)">…</span>
    {:else if typeof it === 'object' && it.href && !last}
      <a
        href={it.href}
        style="text-decoration:none;color:{last
          ? 'var(--text)'
          : 'var(--text-dim)'};font-weight:{last ? 600 : 500}">{lbl(it)}</a
      >
    {:else}
      <span style="color:{last ? 'var(--text)' : 'var(--text-dim)'};font-weight:{last ? 600 : 500}"
        >{lbl(it)}</span
      >
    {/if}
  {/each}
</nav>
