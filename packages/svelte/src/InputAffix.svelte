<script>
  import Icon from './Icon.svelte';
  let {
    value = $bindable(''),
    leadingIcon = undefined,
    prefix = undefined,
    unit = undefined,
    wrapClass = undefined,
    ...rest
  } = $props();
</script>

<div class="ui-affix{wrapClass ? ' ' + wrapClass : ''}">
  {#if leadingIcon}<Icon name={leadingIcon} size={16} />{/if}
  {#if prefix}<span class="unit">{prefix}</span>{/if}
  <input bind:value {...rest} />
  {#if unit}<span class="unit">{unit}</span>{/if}
</div>
