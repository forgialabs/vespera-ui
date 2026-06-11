<script>
  let { checked = $bindable(false), size, disabled = false, label = 'Toggle' } = $props();
</script>

<button
  type="button"
  {disabled}
  class="ui-switch{size === 'sm' ? ' sm' : ''}{checked ? ' on' : ''}"
  aria-pressed={checked}
  aria-label={label}
  onclick={() => (checked = !checked)}
></button>
