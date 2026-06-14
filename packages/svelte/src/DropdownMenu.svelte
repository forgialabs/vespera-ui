<script>
  import Anchored from './Anchored.svelte';
  import Icon from './Icon.svelte';
  let { items = [], align = 'end', width, open = undefined, onOpenChange, trigger } = $props();

  const role = (it) =>
    it.type === 'checkbox' ? 'menuitemcheckbox' : it.type === 'radio' ? 'menuitemradio' : 'menuitem';
  function onKey(e) {
    const k = e.key;
    if (k !== 'ArrowDown' && k !== 'ArrowUp' && k !== 'Home' && k !== 'End') return;
    e.preventDefault();
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    const els = Array.from(parent.querySelectorAll('[role^="menuitem"]:not([disabled])'));
    const i = els.indexOf(e.currentTarget);
    const n = els.length;
    const next =
      k === 'Home'
        ? els[0]
        : k === 'End'
          ? els[n - 1]
          : k === 'ArrowDown'
            ? els[(i + 1) % n]
            : els[(i - 1 + n) % n];
    next?.focus();
  }
</script>

<Anchored {align} {width} {open} {onOpenChange} {trigger}>
  {#snippet children(close)}
    {#each items as it, i (i)}
      {#if it.sep}
        <div class="ui-menu-sep"></div>
      {:else if it.heading}
        <div class="ui-menu-label">{it.label}</div>
      {:else}
        <button
          type="button"
          role={role(it)}
          disabled={it.disabled}
          aria-checked={it.type ? !!it.checked : undefined}
          class="ui-menu-item{it.danger ? ' danger' : ''}"
          onclick={() => {
            it.onClick?.();
            if (!it.type) close();
          }}
          onkeydown={onKey}
        >
          {#if it.type}<span class="ui-menu-check"
              >{#if it.checked}<Icon name="check" size={16} />{/if}</span
            >{:else if it.icon}<Icon name={it.icon} size={15} />{/if}{it.label}{#if it.kbd}<kbd
              class="ui-kbd">{it.kbd}</kbd
            >{/if}
        </button>
      {/if}
    {/each}
  {/snippet}
</Anchored>
