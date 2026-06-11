<script>
  let { value = 0, size = 76, thickness = 7, color = 'var(--accent)', label } = $props();
  let r = $derived((size - thickness) / 2);
  let circ = $derived(2 * Math.PI * r);
</script>

<div style="position:relative;width:{size}px;height:{size}px">
  <svg width={size} height={size} style="transform:rotate(-90deg)">
    <circle
      cx={size / 2}
      cy={size / 2}
      {r}
      fill="none"
      stroke="var(--surface-3)"
      stroke-width={thickness}
    />
    <circle
      cx={size / 2}
      cy={size / 2}
      {r}
      fill="none"
      stroke={color}
      stroke-width={thickness}
      stroke-linecap="round"
      stroke-dasharray={circ}
      stroke-dashoffset={circ * (1 - Math.min(100, value) / 100)}
      style="transition:stroke-dashoffset .5s cubic-bezier(.3,.7,.3,1)"
    />
  </svg>
  <div
    class="tnum"
    style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:{size *
      0.24}px"
  >
    {label ?? `${Math.round(value)}%`}
  </div>
</div>
