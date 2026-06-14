<script>
  import Icon from './Icon.svelte';
  import { portal } from './portal.js';
  import { menuNav } from './menu.js';
  import MenuItems from './MenuItems.svelte';
  let { item, close } = $props();
  let open = $state(false);
  let el = $state();
  let rect = $state(null);
  let timer = null;
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  const openNow = () => {
    cancel();
    if (el) rect = el.getBoundingClientRect();
    open = true;
  };
  const closeSoon = () => {
    cancel();
    timer = setTimeout(() => (open = false), 130);
  };
  function onKey(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      openNow();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      open = false;
    } else menuNav(e);
  }
</script>

<button
  bind:this={el}
  type="button"
  role="menuitem"
  aria-haspopup="menu"
  aria-expanded={open}
  disabled={item.disabled}
  class="ui-menu-item ui-menu-parent{item.danger ? ' danger' : ''}"
  onmouseenter={openNow}
  onmouseleave={closeSoon}
  onclick={openNow}
  onkeydown={onKey}
>
  {#if item.icon}<Icon name={item.icon} size={15} />{/if}{item.label}<svg
    class="ui-menu-sub-arrow"
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
  >
</button>
{#if open && rect}
  <div
    class="ui-menu"
    use:portal
    role="menu"
    style="position:fixed;left:{rect.right - 4}px;top:{rect.top - 6}px;z-index:340"
    onmouseenter={openNow}
    onmouseleave={closeSoon}
  >
    <MenuItems items={item.items} {close} />
  </div>
{/if}
