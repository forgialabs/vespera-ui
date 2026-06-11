<script>
  let { data = [], size = 168, thickness = 22 } = $props();
  let total = $derived(data.reduce((s, d) => s + d.value, 0) || 1);
  let r = $derived((size - thickness) / 2);
  let c = $derived(size / 2);
  let circ = $derived(2 * Math.PI * r);
  let segs = $derived.by(() => {
    let acc = 0;
    return data.map((d) => {
      const len = (d.value / total) * circ;
      const seg = { color: d.color, dash: `${len - 2.5} ${circ - len + 2.5}`, offset: -acc };
      acc += len;
      return seg;
    });
  });
</script>

<div style="display:flex;align-items:center;gap:22px">
  <svg width={size} height={size} style="transform:rotate(-90deg);flex-shrink:0">
    <circle cx={c} cy={c} {r} fill="none" stroke="var(--surface-3)" stroke-width={thickness} />
    {#each segs as s, i (i)}
      <circle
        cx={c}
        cy={c}
        {r}
        fill="none"
        stroke={s.color}
        stroke-width={thickness}
        stroke-dasharray={s.dash}
        stroke-dashoffset={s.offset}
        stroke-linecap="round"
      />
    {/each}
  </svg>
  <div style="display:flex;flex-direction:column;gap:9px;flex:1">
    {#each data as d, i (i)}
      <div style="display:flex;align-items:center;gap:9px;font-size:12.5px">
        <i style="width:9px;height:9px;border-radius:3px;background:{d.color};flex-shrink:0"></i>
        <span style="color:var(--text-dim);flex:1">{d.label}</span>
        <span class="mono tnum" style="font-weight:600">{Math.round((d.value / total) * 100)}%</span>
      </div>
    {/each}
  </div>
</div>
