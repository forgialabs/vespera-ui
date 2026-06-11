<script>
  let { pad = false, children, ...rest } = $props();
</script>

<div class="card{pad ? ' card-pad' : ''}" {...rest}>
  {@render children?.()}
</div>
