<script>
  let {
    data = [],
    size = 168,
    thickness = 22,
    centerLabel = undefined,
    valueFormat = undefined,
    center,
  } = $props();
  function niceNum(n) {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
    return String(n);
  }
  const fmt = (n) => (valueFormat ? valueFormat(n) : niceNum(n));
  let hover = $state(null);
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
  <div style="position:relative;width:{size}px;height:{size}px;flex-shrink:0">
    {#if hover != null}
      <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center">
        <div>
          <div style="font-size:19px;font-weight:800;letter-spacing:-0.02em">{fmt(data[hover].value)}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:2px">{data[hover].label}</div>
        </div>
      </div>
    {:else if center}
      <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center">
        {@render center()}
      </div>
    {:else if centerLabel != null}
      <div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center">
        {centerLabel}
      </div>
    {/if}
    <svg width={size} height={size} style="transform:rotate(-90deg);display:block">
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
          opacity={hover == null || hover === i ? 1 : 0.3}
          style="transition:opacity .15s;cursor:pointer"
          role="presentation"
          onmouseenter={() => (hover = i)}
          onmouseleave={() => (hover = null)}
        />
      {/each}
    </svg>
  </div>
  <div style="display:flex;flex-direction:column;gap:9px;flex:1">
    {#each data as d, i (i)}
      <div
        style="display:flex;align-items:center;gap:9px;font-size:12.5px;cursor:pointer;transition:opacity .15s;opacity:{hover ==
          null || hover === i
          ? 1
          : 0.45}"
        role="presentation"
        onmouseenter={() => (hover = i)}
        onmouseleave={() => (hover = null)}
      >
        <i style="width:9px;height:9px;border-radius:3px;background:{d.color};flex-shrink:0"></i>
        <span style="color:var(--text-dim);flex:1">{d.label}</span>
        <span class="mono tnum" style="font-weight:600">{Math.round((d.value / total) * 100)}%</span>
      </div>
    {/each}
  </div>
</div>
