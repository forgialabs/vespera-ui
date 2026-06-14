<script>
  import { portal } from './portal.js';
  let { label, side = 'top', delay = 0, disabled = false, children } = $props();
  let show = $state(false);
  let pos = $state({ x: 0, y: 0 });
  let el = $state();
  let timer = null;
  const TRANSFORM = {
    top: 'translate(-50%,-100%)',
    bottom: 'translateX(-50%)',
    left: 'translate(-100%,-50%)',
    right: 'translateY(-50%)',
  };
  const place = () => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (side === 'bottom') pos = { x: cx, y: r.bottom + 8 };
    else if (side === 'left') pos = { x: r.left - 8, y: cy };
    else if (side === 'right') pos = { x: r.right + 8, y: cy };
    else pos = { x: cx, y: r.top - 8 };
  };
  const enter = () => {
    if (disabled) return;
    place();
    if (delay > 0) timer = setTimeout(() => (show = true), delay);
    else show = true;
  };
  const leave = () => {
    if (timer != null) {
      clearTimeout(timer);
      timer = null;
    }
    show = false;
  };
</script>

<span
  bind:this={el}
  style="display:inline-flex"
  role="presentation"
  onmouseenter={enter}
  onmouseleave={leave}
  onfocusin={enter}
  onfocusout={leave}
>
  {@render children?.()}
  {#if show}
    <div
      class="ui-tip"
      use:portal
      role="tooltip"
      style="left:{pos.x}px;top:{pos.y}px;transform:{TRANSFORM[side]}"
    >
      {label}
    </div>
  {/if}
</span>
