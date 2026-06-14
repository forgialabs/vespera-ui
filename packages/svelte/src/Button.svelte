<script>
  let {
    variant = 'ghost',
    size = 'md',
    loading = false,
    loadingText = undefined,
    fullWidth = false,
    disabled = false,
    leading,
    trailing,
    children,
    ...rest
  } = $props();
</script>

<button
  class="btn btn-{variant}{size === 'sm' ? ' btn-sm' : ''}{size === 'lg'
    ? ' btn-lg'
    : ''}{fullWidth ? ' btn-block' : ''}"
  disabled={disabled || loading}
  aria-busy={loading || undefined}
  {...rest}
>
  {#if loading}<span class="ui-spinner" aria-hidden="true"></span>{:else}{@render leading?.()}{/if}
  {#if loading && loadingText != null}{loadingText}{:else}{@render children?.()}{/if}
  {#if !loading}{@render trailing?.()}{/if}
</button>
