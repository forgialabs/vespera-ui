<script>
  import Icon from './Icon.svelte';
  let { title, desc = undefined } = $props();
</script>

<div class="ui-empty">
  <Icon name="inbox" size={26} />
  <div class="ui-empty-title">{title}</div>
  {#if desc}<div class="ui-empty-desc">{desc}</div>{/if}
</div>
