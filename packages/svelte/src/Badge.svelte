<script>
  let { tone = 'muted', dot = false, children } = $props();
</script>

<span class="badge badge-{tone}">
  {#if dot}<i></i>{/if}
  {@render children?.()}
</span>
