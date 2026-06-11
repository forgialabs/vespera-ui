<script>
  let { label, children, ...rest } = $props();
</script>

<button type="button" class="vsp-icon-btn" aria-label={label} {...rest}>
  {@render children?.()}
</button>
