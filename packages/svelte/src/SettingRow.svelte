<script>
  let { title = undefined, desc = undefined, last = false, children } = $props();
</script>

<div class="ui-setrow{last ? ' last' : ''}">
  <div class="ui-setrow-main">
    <div class="ui-setrow-title">{title}</div>
    {#if desc}<div class="ui-setrow-desc">{desc}</div>{/if}
  </div>
  {@render children?.()}
</div>
