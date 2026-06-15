<script>
  import Icon from './Icon.svelte';
  let { value = $bindable(), tabs = [] } = $props();
  const id = (t) => (typeof t === 'string' ? t : t.value);
  const lbl = (t) => (typeof t === 'string' ? t : t.label);
  const ico = (t) => (typeof t === 'object' ? t.icon : undefined);
  const bdg = (t) => (typeof t === 'object' ? t.badge : undefined);
</script>

<div class="ui-vtabs">
  {#each tabs as t (id(t))}
    <button
      type="button"
      class="ui-vtab{value === id(t) ? ' on' : ''}"
      onclick={() => (value = id(t))}
    >
      {#if ico(t)}<Icon name={ico(t)} size={16} />{/if}{lbl(t)}{#if bdg(t) != null}<span
          class="ui-nav-badge">{bdg(t)}</span
        >{/if}
    </button>
  {/each}
</div>
