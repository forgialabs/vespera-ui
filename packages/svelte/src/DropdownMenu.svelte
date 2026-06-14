<script>
  import Anchored from './Anchored.svelte';
  import MenuItems from './MenuItems.svelte';
  let { items = [], align = 'end', width, open = undefined, onOpenChange, trigger } = $props();
</script>

<Anchored {align} {width} {open} {onOpenChange} {trigger}>
  {#snippet children(close)}
    <MenuItems {items} {close} />
  {/snippet}
</Anchored>
