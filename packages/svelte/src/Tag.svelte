<script>
  let { children, onremove } = $props();
</script>

<span class="ui-tag">
  {@render children?.()}
  <button type="button" aria-label="Remove" onclick={() => onremove?.()}>×</button>
</span>
