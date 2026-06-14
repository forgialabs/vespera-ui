<script>
  let {
    label,
    size = 'md',
    variant = undefined,
    loading = false,
    disabled = false,
    children,
    ...rest
  } = $props();
</script>

<button
  type="button"
  class="vsp-icon-btn{size === 'sm' ? ' vsp-icon-btn-sm' : ''}{size === 'lg'
    ? ' vsp-icon-btn-lg'
    : ''}{variant ? ` vsp-icon-btn-${variant}` : ''}"
  aria-label={label}
  disabled={disabled || loading}
  aria-busy={loading || undefined}
  {...rest}
>
  {#if loading}<span class="ui-spinner" aria-hidden="true"></span>{:else}{@render children?.()}{/if}
</button>
