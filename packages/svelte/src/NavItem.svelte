<script>
  import Icon from './Icon.svelte';
  let {
    icon = undefined,
    label = undefined,
    active = false,
    badge = undefined,
    sub = false,
    href = undefined,
    disabled = false,
    onclick,
    children,
  } = $props();
</script>

{#snippet inner()}
  {#if icon}<Icon name={icon} size={16} />{/if}
  <span style="flex:{sub ? 'none' : 1}">{label}{@render children?.()}</span>
  {#if badge != null}<span class="ui-nav-badge">{badge}</span>{/if}
{/snippet}

{#if href && !disabled}
  <a
    {href}
    class="ui-nav-item{active ? ' on' : ''}"
    aria-current={active ? 'page' : undefined}
    {onclick}
  >
    {@render inner()}
  </a>
{:else}
  <button
    type="button"
    {disabled}
    class="ui-nav-item{active ? ' on' : ''}{disabled ? ' disabled' : ''}"
    {onclick}
  >
    {@render inner()}
  </button>
{/if}
