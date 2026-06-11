<script>
  let { text, label = 'Copy', size = 'sm' } = $props();
  let done = $state(false);
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    done = true;
    setTimeout(() => (done = false), 1400);
  };
</script>

<button type="button" class="btn btn-ghost{size === 'sm' ? ' btn-sm' : ''}" onclick={copy}>
  {#if done}
    <span style="color:var(--success);display:inline-flex">
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
      >
    </span>Copied
  {:else}
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      ><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6" /></svg
    >{label}
  {/if}
</button>
