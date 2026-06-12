<script>
  import Anchored from './Anchored.svelte';
  import Icon from './Icon.svelte';
  let { items = [], align = 'end', width, trigger } = $props();
</script>

<Anchored {align} {width} {trigger}>
  {#snippet children(close)}
    {#each items as it, i (i)}
      {#if it.sep}
        <div class="ui-menu-sep"></div>
      {:else if it.heading}
        <div class="ui-menu-label">{it.label}</div>
      {:else}
        <button
          type="button"
          class="ui-menu-item{it.danger ? ' danger' : ''}"
          onclick={() => {
            it.onClick?.();
            close();
          }}
        >
          {#if it.icon}<Icon name={it.icon} size={15} />{/if}{it.label}{#if it.kbd}<kbd
              class="ui-kbd">{it.kbd}</kbd
            >{/if}
        </button>
      {/if}
    {/each}
  {/snippet}
</Anchored>
