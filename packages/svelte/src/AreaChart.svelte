<script module>
  let acUid = 0;
</script>

<script>
  let {
    series = [],
    labels,
    width = 760,
    height = 260,
    color = 'var(--accent)',
    color2 = 'var(--accent-2)',
    dual = false,
  } = $props();
  const gid = 'ac' + ++acUid;
  function niceNum(n) {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
    return String(n);
  }
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
    }
    return d;
  }
  const padL = 38,
    padB = 26,
    padT = 12,
    padR = 8;
  let innerW = $derived(Math.max(10, width - padL - padR));
  let innerH = $derived(height - padB - padT);
  let s0 = $derived(series[0] ?? []);
  let s1 = $derived(series[1]);
  let max = $derived(Math.max(...(dual && s1 ? [...s0, ...s1] : s0), 0) * 1.12);
  let rng = $derived(max || 1);
  const sx = (i, len) => padL + (i / Math.max(1, len - 1)) * innerW;
  const sy = (v) => padT + innerH - (v / rng) * innerH;
  let lines = $derived(
    (dual && s1 ? [s0, s1] : [s0]).map((arr) => arr.map((v, i) => [sx(i, arr.length), sy(v)])),
  );
  let ticks = $derived(
    Array.from({ length: 5 }, (_, i) => ({
      y: sy((max / 4) * i),
      label: niceNum(Math.round((max / 4) * i)),
    })),
  );
</script>

<svg {width} {height} style="display:block">
  <defs
    ><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"
      ><stop offset="0" stop-color={color} stop-opacity="0.22" /><stop
        offset="1"
        stop-color={color}
        stop-opacity="0"
      /></linearGradient
    ></defs
  >
  {#each ticks as t}
    <line x1={padL} x2={width - padR} y1={t.y} y2={t.y} stroke="var(--grid-line)" stroke-width="1" />
    <text
      x={padL - 8}
      y={t.y + 3.5}
      text-anchor="end"
      font-size="10"
      fill="var(--text-faint)"
      font-family="var(--font-mono)">{t.label}</text
    >
  {/each}
  {#if labels}
    {#each labels as lb, i}
      {#if i % Math.ceil(labels.length / 7) === 0}
        <text
          x={sx(i, labels.length)}
          y={height - 8}
          text-anchor="middle"
          font-size="10"
          fill="var(--text-faint)"
          font-family="var(--font-mono)">{lb}</text
        >
      {/if}
    {/each}
  {/if}
  {#each lines as pts, li}
    {#if li === 0 && pts.length}
      <path
        d="{smoothPath(pts)} L {pts[pts.length - 1][0]} {padT + innerH} L {pts[0][0]} {padT +
          innerH} Z"
        fill="url(#{gid})"
      />
    {/if}
    <path
      d={smoothPath(pts)}
      fill="none"
      stroke={li === 0 ? color : color2}
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-dasharray={li === 1 ? '5 5' : null}
      style="opacity:{li === 1 ? 0.7 : 1}"
    />
  {/each}
</svg>
