<script>
  let { tone = 'info', dismissible = false, icon, action, children, ondismiss } = $props();
  const ICON = {
    info: 'M12 3l1.6 5L19 9.6l-5 1.6L12 16l-1.6-4.8L5 9.6l5.4-1.6z',
    warn: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9',
    accent: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    pos: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
    neg: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
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
