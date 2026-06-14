<script>
  let {
    data = [],
    labels,
    width = 620,
    height = 240,
    color = undefined,
    colors = undefined,
    seriesLabels = undefined,
    horizontal = false,
    stacked = false,
    valueFormat = undefined,
    showValues = false,
  } = $props();

  const PALETTE = [
    'var(--accent)',
    'var(--accent-2)',
    'var(--success)',
    'var(--warning)',
    'var(--danger)',
  ];
  function niceNum(n) {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
    return String(n);
  }

  let hover = $state(null);
  const padB = 26,
    padT = 10,
    padR = 10;

  let series = $derived(Array.isArray(data[0]) ? data : [data]);
  let nSeries = $derived(series.length);
  let nCats = $derived(series.reduce((m, s) => Math.max(m, s.length), 0));
  const colorAt = (s) => colors?.[s] ?? (s === 0 && color ? color : PALETTE[s % PALETTE.length]);
  const fmt = (n) => (valueFormat ? valueFormat(n) : niceNum(n));
  let padL = $derived(horizontal ? 60 : 34);
  let max = $derived(
    ((stacked
      ? Math.max(...Array.from({ length: nCats }, (_, i) => series.reduce((s, a) => s + (a[i] ?? 0), 0)), 0)
      : Math.max(...series.flat(), 0)) || 1) * 1.15,
  );
  let valAxis = $derived(horizontal ? Math.max(10, width - padL - padR) : height - padB - padT);
  let catAxis = $derived(horizontal ? height - padT - padB : Math.max(10, width - padL - padR));
  let band = $derived(catAxis / nCats);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  function barRect(cs, thick, vStart, vLen) {
    if (horizontal)
      return { x: padL + (vStart / max) * valAxis, y: padT + cs, w: (vLen / max) * valAxis, h: thick };
    return {
      x: padL + cs,
      y: padT + valAxis - ((vStart + vLen) / max) * valAxis,
      w: thick,
      h: (vLen / max) * valAxis,
    };
  }
  let bars = $derived.by(() => {
    const out = [];
    for (let i = 0; i < nCats; i++) {
      if (stacked) {
        let acc = 0;
        series.forEach((arr, s) => {
          const v = arr[i] ?? 0;
          out.push({ ...barRect(i * band + band * 0.18, band * 0.64, acc, v), fill: colorAt(s), i });
          acc += v;
        });
      } else {
        const sub = (band * 0.64) / nSeries;
        series.forEach((arr, s) => {
          const v = arr[i] ?? 0;
          out.push({ ...barRect(i * band + band * 0.18 + s * sub, sub * 0.86, 0, v), fill: colorAt(s), i });
        });
      }
    }
    return out;
  });
</script>

<div style="position:relative">
  <svg {width} {height} style="display:block">
    {#each ticks as f, i (i)}
      {@const p = horizontal ? padL + f * valAxis : padT + valAxis - f * valAxis}
      <line
        x1={horizontal ? p : padL}
        x2={horizontal ? p : padL + catAxis}
        y1={horizontal ? padT : p}
        y2={horizontal ? padT + catAxis : p}
        stroke="var(--grid-line)"
      />
      <text
        x={horizontal ? p : padL - 8}
        y={horizontal ? height - 8 : p + 3.5}
        text-anchor={horizontal ? 'middle' : 'end'}
        font-size="10"
        fill="var(--text-faint)"
        font-family="var(--font-mono)">{fmt(Math.round(max * f))}</text
      >
    {/each}
    {#each bars as b, k (k)}
      <rect
        x={b.x}
        y={b.y}
        width={Math.max(0, b.w)}
        height={Math.max(0, b.h)}
        rx="4"
        fill={hover === b.i ? b.fill : `color-mix(in oklab, ${b.fill} 80%, transparent)`}
        style="transition:fill .15s"
      />
    {/each}
    {#each Array(nCats) as _, i (i)}
      {@const center = i * band + band / 2}
      <g
        role="presentation"
        onmouseenter={() => (hover = i)}
        onmouseleave={() => (hover = null)}
      >
        <rect
          x={horizontal ? padL : padL + i * band}
          y={horizontal ? padT + i * band : padT}
          width={horizontal ? valAxis : band}
          height={horizontal ? band : valAxis}
          fill="transparent"
        />
        {#if labels?.[i] != null}
          <text
            x={horizontal ? padL - 8 : padL + center}
            y={horizontal ? padT + center + 3.5 : height - 8}
            text-anchor={horizontal ? 'end' : 'middle'}
            font-size="10"
            fill="var(--text-faint)"
            font-family="var(--font-mono)">{labels[i]}</text
          >
        {/if}
        {#if showValues && !stacked && nSeries === 1}
          {@const r = barRect(i * band + band * 0.18, band * 0.64, 0, series[0][i] ?? 0)}
          <text
            x={horizontal ? r.x + r.w + 4 : r.x + r.w / 2}
            y={horizontal ? r.y + r.h / 2 + 3.5 : r.y - 4}
            text-anchor={horizontal ? 'start' : 'middle'}
            font-size="10"
            fill="var(--text-dim)"
            font-family="var(--font-mono)">{fmt(series[0][i] ?? 0)}</text
          >
        {/if}
      </g>
    {/each}
  </svg>
  {#if hover != null}
    <div
      class="ui-chart-tip"
      style="position:absolute;left:{horizontal
        ? padL + 8
        : padL + hover * band + band / 2}px;top:{horizontal
        ? padT + hover * band + band / 2
        : padT + 4}px;transform:translate(-50%,-100%);pointer-events:none"
    >
      {#if labels?.[hover] != null}<div class="ui-chart-tip-label">{labels[hover]}</div>{/if}
      {#each series as arr, s (s)}
        <div class="ui-chart-tip-row">
          <i style="background:{colorAt(s)}"></i>
          {#if seriesLabels?.[s]}<span>{seriesLabels[s]}</span>{/if}
          <b>{fmt(arr[hover] ?? 0)}</b>
        </div>
      {/each}
    </div>
  {/if}
  {#if nSeries > 1 && seriesLabels}
    <div class="ui-chart-legend">
      {#each seriesLabels as lb, s (s)}
        <span><i style="background:{colorAt(s)}"></i>{lb}</span>
      {/each}
    </div>
  {/if}
</div>
