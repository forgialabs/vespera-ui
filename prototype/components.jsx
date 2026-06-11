// components.jsx — shared building blocks + SVG charts. Depends on window.Icon.
const { useState, useRef, useEffect } = React;

/* ---- helpers ---- */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return d;
}
const niceNum = (n) => {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
  return String(n);
};

/* ---- Sparkline ---- */
function Sparkline({ data, color = 'var(--accent)', w = 110, h = 34, fill = true }) {
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - 3 - ((v - min) / rng) * (h - 6),
  ]);
  const d = smoothPath(pts);
  const gid = 'spk' + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      {fill && <>
        <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient></defs>
        <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={`url(#${gid})`} />
      </>}
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

/* ---- AreaChart (line + gradient fill, hover tooltip) ---- */
function AreaChart({ series, labels, height = 260, color = 'var(--accent)', color2 = 'var(--accent-2)', dual = false }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(760);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);
  const padL = 38, padB = 26, padT = 12, padR = 8;
  const innerW = Math.max(10, w - padL - padR);
  const innerH = height - padB - padT;
  const all = dual ? [...series[0], ...series[1]] : series[0];
  const max = Math.max(...all) * 1.12, min = 0;
  const rng = max - min || 1;
  const sx = (i, arr) => padL + (i / (arr.length - 1)) * innerW;
  const sy = (v) => padT + innerH - ((v - min) / rng) * innerH;
  const mkPts = (arr) => arr.map((v, i) => [sx(i, arr), sy(v)]);
  const yTicks = 4;

  const colors = [color, color2];
  const lines = (dual ? series : [series[0]]).map(mkPts);

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const i = Math.round(((x - padL) / innerW) * (series[0].length - 1));
    if (i >= 0 && i < series[0].length) setHover(i);
  };
  return (
    <div ref={wrapRef} style={{ position: 'relative' }} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg width={w} height={height} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ac-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.22" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const v = (max / yTicks) * i;
          const y = sy(v);
          return <g key={i}>
            <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="var(--grid-line)" strokeWidth="1" />
            <text x={padL - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="var(--text-faint)" fontFamily="var(--font-mono)">{niceNum(Math.round(v))}</text>
          </g>;
        })}
        {labels && labels.map((lb, i) => i % Math.ceil(labels.length / 7) === 0 && (
          <text key={i} x={sx(i, labels)} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-faint)" fontFamily="var(--font-mono)">{lb}</text>
        ))}
        {lines.map((pts, li) => (
          <g key={li}>
            {li === 0 && <path d={`${smoothPath(pts)} L ${pts[pts.length-1][0]} ${padT+innerH} L ${pts[0][0]} ${padT+innerH} Z`} fill="url(#ac-fill)" />}
            <path d={smoothPath(pts)} fill="none" stroke={colors[li]} strokeWidth="2.4" strokeLinecap="round"
                  strokeDasharray={li === 1 ? '5 5' : undefined} style={{ opacity: li === 1 ? 0.7 : 1 }} />
          </g>
        ))}
        {hover != null && <>
          <line x1={sx(hover, series[0])} x2={sx(hover, series[0])} y1={padT} y2={padT + innerH} stroke="var(--border-strong)" strokeWidth="1" />
          {lines.map((pts, li) => <circle key={li} cx={pts[hover][0]} cy={pts[hover][1]} r="4" fill="var(--surface-1)" stroke={colors[li]} strokeWidth="2.5" />)}
        </>}
      </svg>
      {hover != null && (
        <div style={{ position: 'absolute', left: Math.min(sx(hover, series[0]) + 10, w - 130), top: 8,
          background: 'var(--surface-3)', border: '1px solid var(--border-strong)', borderRadius: 8,
          padding: '7px 10px', pointerEvents: 'none', boxShadow: 'var(--shadow)', fontSize: 11.5 }}>
          <div className="eyebrow" style={{ marginBottom: 3 }}>{labels ? labels[hover] : `#${hover}`}</div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{niceNum(series[0][hover])}</div>
        </div>
      )}
    </div>
  );
}

/* ---- BarChart ---- */
function BarChart({ data, labels, height = 240, color = 'var(--accent)' }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(620);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);
  const padL = 34, padB = 26, padT = 10;
  const innerW = Math.max(10, w - padL - 8), innerH = height - padB - padT;
  const max = Math.max(...data) * 1.15;
  const bw = innerW / data.length;
  return (
    <div ref={wrapRef}>
      <svg width={w} height={height} style={{ display: 'block' }}>
        {[0, .5, 1].map((f, i) => {
          const y = padT + innerH - f * innerH;
          return <g key={i}>
            <line x1={padL} x2={w - 8} y1={y} y2={y} stroke="var(--grid-line)" />
            <text x={padL - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="var(--text-faint)" fontFamily="var(--font-mono)">{niceNum(Math.round(max * f))}</text>
          </g>;
        })}
        {data.map((v, i) => {
          const bh = (v / max) * innerH;
          const x = padL + i * bw + bw * 0.18;
          const bwi = bw * 0.64;
          const active = hover === i;
          return <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect x={padL + i * bw} y={padT} width={bw} height={innerH} fill="transparent" />
            <rect x={x} y={padT + innerH - bh} width={bwi} height={bh} rx="4"
                  fill={active ? color : `color-mix(in oklab, ${color} 78%, transparent)`}
                  style={{ transition: 'fill .15s' }} />
            {labels && <text x={x + bwi / 2} y={height - 8} textAnchor="middle" fontSize="10" fill="var(--text-faint)" fontFamily="var(--font-mono)">{labels[i]}</text>}
          </g>;
        })}
      </svg>
    </div>
  );
}

/* ---- Donut ---- */
function Donut({ data, size = 168, thickness = 22 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const len = frac * circ;
          const seg = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={thickness}
            strokeDasharray={`${len - 2.5} ${circ - len + 2.5}`} strokeDashoffset={-acc} strokeLinecap="round" />;
          acc += len;
          return seg;
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5 }}>
            <i style={{ width: 9, height: 9, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-dim)', flex: 1 }}>{d.label}</span>
            <span className="mono tnum" style={{ fontWeight: 600 }}>{Math.round(d.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- StatCard ---- */
function StatCard({ icon, label, value, delta, deltaDir = 'up', spark, sparkColor }) {
  const I = window.Icon[icon];
  const Arrow = deltaDir === 'up' ? window.Icon.arrowUp : window.Icon.arrowDown;
  return (
    <div className="card card-pad vsp-rise" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center',
            background: 'color-mix(in oklab, var(--accent) 13%, transparent)', color: 'var(--accent)' }}>
            {I && <I />}
          </span>
          <span className="eyebrow">{label}</span>
        </div>
        {delta != null && (
          <span className={`badge ${deltaDir === 'up' ? 'badge-pos' : 'badge-neg'}`}>
            <Arrow style={{ width: 11, height: 11 }} />{delta}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div className="tnum" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1 }}>{value}</div>
        {spark && <Sparkline data={spark} color={sparkColor || 'var(--accent)'} />}
      </div>
    </div>
  );
}

/* ---- Avatar ---- */
function Av({ name, hue = 0, size = 34 }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="vsp-avatar" style={{ width: size, height: size, fontSize: size * 0.38,
      background: `linear-gradient(140deg, oklch(0.62 0.16 ${hue}), oklch(0.55 0.17 ${(hue+50)%360}))` }}>
      {initials}
    </span>
  );
}

/* ---- Segmented (in-page tabs) ---- */
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'var(--surface-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} className="mono"
          style={{ border: 0, cursor: 'pointer', padding: '5px 12px', borderRadius: 'calc(var(--r-sm) - 2px)', fontSize: 11.5, fontWeight: 600,
            letterSpacing: '.03em', textTransform: 'uppercase', transition: 'all .15s',
            background: value === o ? 'var(--surface-1)' : 'transparent',
            color: value === o ? 'var(--text)' : 'var(--text-faint)',
            boxShadow: value === o ? 'var(--shadow)' : 'none' }}>
          {o}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { Sparkline, AreaChart, BarChart, Donut, StatCard, Av, Segmented, niceNum, smoothPath });
