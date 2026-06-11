<script>
  let { tone = 'info', dismissible = false, icon, action, children, ondismiss } = $props();
  const ICON = {
    info: 'M12 3l1.6 5L19 9.6l-5 1.6L12 16l-1.6-4.8L5 9.6l5.4-1.6z',
    warn: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9',
    accent: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  };
</script>

<div class="ui-banner {tone}">
  {#if icon}{@render icon()}{:else}
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"><path d={ICON[tone]} /></svg
    >
  {/if}
  <div style="flex:1;font-size:13px;font-weight:500">{@render children?.()}</div>
  {@render action?.()}
  {#if dismissible}
    <button type="button" class="ui-banner-x" aria-label="Dismiss" onclick={() => ondismiss?.()}>
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg
      >
    </button>
  {/if}
</div>
