<script>
  import { portal } from './portal.js';
  let { label, side = 'top', children } = $props();
  let show = $state(false);
  let pos = $state({ x: 0, y: 0 });
  let el = $state();
  const place = () => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    pos = { x: r.left + r.width / 2, y: side === 'bottom' ? r.bottom + 8 : r.top - 8 };
  };
  const enter = () => {
    place();
    show = true;
  };
</script>

<span
  bind:this={el}
  style="display:inline-flex"
  role="presentation"
  onmouseenter={enter}
  onmouseleave={() => (show = false)}
  onfocusin={enter}
  onfocusout={() => (show = false)}
>
  {@render children?.()}
  {#if show}
    <div
      class="ui-tip"
      use:portal
      style="left:{pos.x}px;top:{pos.y}px;transform:{side === 'bottom'
        ? 'translateX(-50%)'
        : 'translate(-50%,-100%)'}"
    >
      {label}
    </div>
  {/if}
</span>
