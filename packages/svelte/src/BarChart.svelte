<script>
  let { data = [], labels, width = 620, height = 240, color = 'var(--accent)' } = $props();
  function niceNum(n) {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
    return String(n);
  }
  const padL = 34,
    padB = 26,
    padT = 10;
  let innerW = $derived(Math.max(10, width - padL - 8));
  let innerH = $derived(height - padB - padT);
  let max = $derived(Math.max(...data, 0) * 1.15 || 1);
  let bw = $derived(innerW / (data.length || 1));
  let grid = $derived(
    [0, 0.5, 1].map((f) => ({ y: padT + innerH - f * innerH, label: niceNum(Math.round(max * f)) })),
  );
  let bars = $derived(
    data.map((v, i) => {
      const bh = (v / max) * innerH;
      const x = padL + i * bw + bw * 0.18;
      const bwi = bw * 0.64;
      return { x, y: padT + innerH - bh, w: bwi, h: bh, label: labels?.[i] };
    }),
  );
</script>

<svg {width} {height} style="display:block">
  {#each grid as g}
    <line x1={padL} x2={width - 8} y1={g.y} y2={g.y} stroke="var(--grid-line)" />
    <text
      x={padL - 8}
      y={g.y + 3.5}
      text-anchor="end"
      font-size="10"
      fill="var(--text-faint)"
      font-family="var(--font-mono)">{g.label}</text
    >
  {/each}
  {#each bars as b, i (i)}
    <rect
      x={b.x}
      y={b.y}
      width={b.w}
      height={b.h}
      rx="4"
      fill="color-mix(in oklab, {color} 78%, transparent)"
    />
    {#if b.label != null}<text
        x={b.x + b.w / 2}
        y={height - 8}
        text-anchor="middle"
        font-size="10"
        fill="var(--text-faint)"
        font-family="var(--font-mono)">{b.label}</text
      >{/if}
  {/each}
</svg>
