<script>
  let { size = 'md', label = undefined } = $props();
</script>

<span
  class="ui-spinner{size === 'sm' ? ' sm' : ''}{size === 'lg' ? ' lg' : ''}"
  role={label ? 'status' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
></span>
