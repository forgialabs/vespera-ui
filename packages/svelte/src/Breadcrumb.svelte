<script>
  let { items = [] } = $props();
</script>

<nav style="display:flex;align-items:center;gap:7px;font-size:12.5px">
  {#each items as it, i}
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
    <span
      style="color:{i === items.length - 1 ? 'var(--text)' : 'var(--text-dim)'};font-weight:{i ===
      items.length - 1
        ? 600
        : 500}">{it}</span
    >
  {/each}
</nav>
