<script>
  let { page = $bindable(0), pages = 1 } = $props();
  let nums = $derived.by(() => {
    const r = [];
    for (let i = 0; i < pages; i++) {
      if (i === 0 || i === pages - 1 || Math.abs(i - page) <= 1) r.push(i);
      else if (r[r.length - 1] !== '…') r.push('…');
    }
    return r;
  });
</script>

<div style="display:flex;gap:4px;align-items:center">
  <button
    type="button"
    class="btn btn-ghost btn-sm"
    disabled={page === 0}
    aria-label="Previous page"
    onclick={() => (page -= 1)}
  >
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg
    >
  </button>
  {#each nums as n, i (i)}
    {#if n === '…'}
      <span class="mono" style="padding:0 6px;color:var(--text-faint)">…</span>
    {:else}
      <button
        type="button"
        class="btn btn-sm {n === page ? 'btn-primary' : 'btn-subtle'}"
        style="min-width:32px;padding:0"
        onclick={() => (page = n)}>{n + 1}</button
      >
    {/if}
  {/each}
  <button
    type="button"
    class="btn btn-ghost btn-sm"
    disabled={page >= pages - 1}
    aria-label="Next page"
    onclick={() => (page += 1)}
  >
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
    >
  </button>
</div>
