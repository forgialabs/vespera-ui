<script>
  let { variant = 'ghost', size, loading = false, disabled = false, children, ...rest } = $props();
</script>

<button
  class="btn btn-{variant}{size === 'sm' ? ' btn-sm' : ''}"
  disabled={disabled || loading}
  {...rest}
>
  {#if loading}<span class="ui-spinner" aria-hidden="true"></span>{/if}
  {@render children?.()}
</button>
