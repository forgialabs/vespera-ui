<script>
  let { value = $bindable(), options = [] } = $props();
</script>

<div class="ui-seg">
  {#each options as o (o)}
    <button type="button" class={value === o ? 'on' : ''} onclick={() => (value = o)}>{o}</button>
  {/each}
</div>
