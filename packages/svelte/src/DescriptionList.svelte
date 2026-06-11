<script>
  let { items = [] } = $props();
</script>

<dl class="ui-dl">
  {#each items as [k, v], i (i)}
    <dt class={i === items.length - 1 ? 'last' : ''}>{k}</dt>
    <dd class={i === items.length - 1 ? 'last' : ''}>{v}</dd>
  {/each}
</dl>
