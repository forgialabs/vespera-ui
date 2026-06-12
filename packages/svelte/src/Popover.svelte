<script>
  import Anchored from './Anchored.svelte';
  let { align = 'start', width = 260, trigger, children } = $props();
</script>

<Anchored {align} {width} layerClass="ui-popover" {trigger} {children} />
