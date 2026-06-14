<script>
  let { value = 0, tone, height = 6, max = 100, indeterminate = false, label = undefined } = $props();
  let pct = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div
  class="meter{indeterminate ? ' indeterminate' : ''}"
  style="height:{height}px"
  role="progressbar"
  aria-label={label}
  aria-valuemin={indeterminate ? undefined : 0}
  aria-valuemax={indeterminate ? undefined : max}
  aria-valuenow={indeterminate ? undefined : value}
>
  {#if indeterminate}
    <i style={tone ? `background:${tone}` : ''}></i>
  {:else}
    <i style="width:{pct}%;{tone ? `background:${tone};` : ''}transition:width .3s"></i>
  {/if}
</div>
