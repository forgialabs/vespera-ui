<script module>
  let uid = 0;
</script>

<script>
  let { data = [], color = 'var(--accent)', w = 110, h = 34, fill = true } = $props();
  const gid = 'spk' + ++uid;
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
  let pts = $derived.by(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const rng = max - min || 1;
    return data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / rng) * (h - 6)]);
  });
  let d = $derived(smoothPath(pts));
  let last = $derived(pts[pts.length - 1] ?? [0, 0]);
</script>

<svg width={w} height={h} viewBox="0 0 {w} {h}" style="display:block;overflow:visible">
  {#if fill}
    <defs
      ><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"
        ><stop offset="0" stop-color={color} stop-opacity="0.28" /><stop
          offset="1"
          stop-color={color}
          stop-opacity="0"
        /></linearGradient
      ></defs
    >
    <path d="{d} L {w} {h} L 0 {h} Z" fill="url(#{gid})" />
  {/if}
  <path {d} fill="none" stroke={color} stroke-width="2" stroke-linecap="round" />
  <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
</svg>
