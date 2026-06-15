<script>
  import Icon from './Icon.svelte';
  let { icon = undefined, label = undefined, defaultOpen = false, children } = $props();
  let open = $state(defaultOpen);
</script>

<div class="ui-nav-group{open ? ' open' : ''}">
  <button type="button" class="ui-nav-item{open ? ' open' : ''}" onclick={() => (open = !open)}>
    {#if icon}<Icon name={icon} size={16} />{/if}
    <span>{label}</span>
    <svg
      class="ui-nav-chev"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
    >
  </button>
  <div class="ui-nav-sub">
    <div>
      <div class="ui-nav" style="padding-top:2px">{@render children?.()}</div>
    </div>
  </div>
</div>
