<script>
  import Icon from './Icon.svelte';
  import SubMenuItem from './SubMenuItem.svelte';
  import { menuNav } from './menu.js';
  let { items = [], close } = $props();
  const role = (it) =>
    it.type === 'checkbox' ? 'menuitemcheckbox' : it.type === 'radio' ? 'menuitemradio' : 'menuitem';
</script>

{#each items as it, i (i)}
  {#if it.sep}
    <div class="ui-menu-sep"></div>
  {:else if it.heading}
    <div class="ui-menu-label">{it.label}</div>
  {:else if it.items && it.items.length}
    <SubMenuItem item={it} {close} />
  {:else}
    <button
      type="button"
      role={role(it)}
      disabled={it.disabled}
      aria-checked={it.type ? !!it.checked : undefined}
      class="ui-menu-item{it.danger ? ' danger' : ''}"
      onclick={() => {
        it.onClick?.();
        if (!it.type) close?.();
      }}
      onkeydown={menuNav}
    >
      {#if it.type}<span class="ui-menu-check"
          >{#if it.checked}<Icon name="check" size={16} />{/if}</span
        >{:else if it.icon}<Icon name={it.icon} size={15} />{/if}{it.label}{#if it.kbd}<kbd
          class="ui-kbd">{it.kbd}</kbd
        >{/if}
    </button>
  {/if}
{/each}
