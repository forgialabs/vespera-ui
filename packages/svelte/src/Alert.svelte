<script>
  let { tone = 'info', title, icon, action, children } = $props();
</script>

<div class="ui-alert {tone}">
  {@render icon?.()}
  <div style="flex:1">
    {#if title}<div class="ui-alert-title">{title}</div>{/if}
    {#if children}<div class="ui-alert-body">{@render children()}</div>{/if}
  </div>
  {@render action?.()}
</div>
