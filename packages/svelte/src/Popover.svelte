<script>
  import Anchored from './Anchored.svelte';
  let { align = 'start', width = 260, open = undefined, onOpenChange, trigger, children } = $props();
</script>

<Anchored {align} {width} {open} {onOpenChange} layerClass="ui-popover" {trigger} {children} />
