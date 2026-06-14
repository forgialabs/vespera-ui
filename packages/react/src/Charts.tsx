import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { Icon } from '@vespera-ui/icons';

type Pt = [number, number];

/** Smooth (cubic) SVG path through a list of points. */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0]![0]} ${pts[0]![1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  return d;
}

/** Compact number formatting: 1500 → "1.5k", 2_000_000 → "2M". */
export function niceNum(n: number): string {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'k';
  return String(n);
}

function useWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (e) setW(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export interface SparklineProps {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
  fill?: boolean;
}

export function Sparkline({
  data,
  color = 'var(--accent)',
  w = 110,
  h = 34,
  fill = true,
}: SparklineProps) {
  const gid = 'spk' + useId().replace(/:/g, '');
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rng = max - min || 1;
  const pts: Pt[] = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - 3 - ((v - min) / rng) * (h - 6),
  ]);
  const d = smoothPath(pts);
  const last = pts[pts.length - 1] ?? [0, 0];
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.28" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={`url(#${gid})`} />
        </>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}

export interface AreaChartProps {
  /** One series (`[data]`) or two when `dual`. */
  series: number[][];
  labels?: string[];
  height?: number;
  color?: string;
  color2?: string;
  dual?: boolean;
}

export function AreaChart({
  series,
  labels,
  height = 260,
  color = 'var(--accent)',
  color2 = 'var(--accent-2)',
  dual = false,
}: AreaChartProps) {
  const [wrapRef, w] = useWidth(760);
  const [hover, setHover] = useState<number | null>(null);
  const gid = 'ac' + useId().replace(/:/g, '');

  const padL = 38;
  const padB = 26;
  const padT = 12;
  const padR = 8;
  const innerW = Math.max(10, w - padL - padR);
  const innerH = height - padB - padT;
  const s0 = series[0] ?? [];
  const s1 = series[1];
  const all = dual && s1 ? [...s0, ...s1] : s0;
  const max = Math.max(...all, 0) * 1.12;
  const rng = max || 1;
  const sx = (i: number, len: number) => padL + (i / Math.max(1, len - 1)) * innerW;
  const sy = (v: number) => padT + innerH - (v / rng) * innerH;
  const mkPts = (arr: number[]): Pt[] => arr.map((v, i) => [sx(i, arr.length), sy(v)]);
  const lines: Pt[][] = (dual && s1 ? [s0, s1] : [s0]).map(mkPts);
  const yTicks = 4;

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - padL) / innerW) * (s0.length - 1));
    if (i >= 0 && i < s0.length) setHover(i);
  };

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative' }}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <svg width={w} height={height} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.22" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = sy((max / yTicks) * i);
          return (
            <g key={i}>
              <line
                x1={padL}
                x2={w - padR}
                y1={y}
                y2={y}
                stroke="var(--grid-line)"
                strokeWidth="1"
              />
              <text
                x={padL - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-faint)"
                fontFamily="var(--font-mono)"
              >
                {niceNum(Math.round((max / yTicks) * i))}
              </text>
            </g>
          );
        })}
        {labels?.map((lb, i) =>
          i % Math.ceil(labels.length / 7) === 0 ? (
            <text
              key={i}
              x={sx(i, labels.length)}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-faint)"
              fontFamily="var(--font-mono)"
            >
              {lb}
            </text>
          ) : null,
        )}
        {lines.map((pts, li) => {
          const stroke = li === 0 ? color : color2;
          const lastPt = pts[pts.length - 1];
          const firstPt = pts[0];
          return (
            <g key={li}>
              {li === 0 && firstPt && lastPt && (
                <path
                  d={`${smoothPath(pts)} L ${lastPt[0]} ${padT + innerH} L ${firstPt[0]} ${padT + innerH} Z`}
                  fill={`url(#${gid})`}
                />
              )}
              <path
                d={smoothPath(pts)}
                fill="none"
                stroke={stroke}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray={li === 1 ? '5 5' : undefined}
                style={{ opacity: li === 1 ? 0.7 : 1 }}
              />
            </g>
          );
        })}
        {hover != null && (
          <>
            <line
              x1={sx(hover, s0.length)}
              x2={sx(hover, s0.length)}
              y1={padT}
              y2={padT + innerH}
              stroke="var(--border-strong)"
              strokeWidth="1"
            />
            {lines.map((pts, li) => {
              const p = pts[hover];
              return p ? (
                <circle
                  key={li}
                  cx={p[0]}
                  cy={p[1]}
                  r="4"
                  fill="var(--surface-1)"
                  stroke={li === 0 ? color : color2}
                  strokeWidth="2.5"
                />
              ) : null;
            })}
          </>
        )}
      </svg>
      {hover != null && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(sx(hover, s0.length) + 10, w - 130),
            top: 8,
            background: 'var(--surface-3)',
            border: '1px solid var(--border-strong)',
            borderRadius: 8,
            padding: '7px 10px',
            pointerEvents: 'none',
            boxShadow: 'var(--shadow)',
            fontSize: 11.5,
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 3 }}>
            {labels ? labels[hover] : `#${hover}`}
          </div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {niceNum(s0[hover] ?? 0)}
          </div>
        </div>
      )}
    </div>
  );
}

const BAR_PALETTE = [
  'var(--accent)',
  'var(--accent-2)',
  'var(--success)',
  'var(--warning)',
  'var(--danger)',
];

export interface BarChartProps {
  /** One series (`number[]`) or several (`number[][]`). */
  data: number[] | number[][];
  labels?: string[];
  height?: number;
  color?: string;
  /** Per-series colors (overrides the default palette). */
  colors?: string[];
  /** Series names — when given (and multi-series) a legend is shown. */
  seriesLabels?: string[];
  /** Lay bars left-to-right instead of bottom-up. */
  horizontal?: boolean;
  /** Stack series within each category instead of grouping side-by-side. */
  stacked?: boolean;
  /** Format values for the tooltip + value labels. */
  valueFormat?: (n: number) => string;
  /** Print each value on its bar. */
  showValues?: boolean;
}

export function BarChart({
  data,
  labels,
  height = 240,
  color,
  colors,
  seriesLabels,
  horizontal = false,
  stacked = false,
  valueFormat,
  showValues = false,
}: BarChartProps) {
  const series: number[][] = Array.isArray(data[0]) ? (data as number[][]) : [data as number[]];
  const nSeries = series.length;
  const nCats = series.reduce((m, s) => Math.max(m, s.length), 0);
  const colorAt = (s: number) =>
    colors?.[s] ?? (s === 0 && color ? color : BAR_PALETTE[s % BAR_PALETTE.length]!);
  const fmt = valueFormat ?? ((n: number) => niceNum(n));
  const [wrapRef, w] = useWidth(620);
  const [hover, setHover] = useState<number | null>(null);

  const catTotal = (i: number) => series.reduce((s, arr) => s + (arr[i] ?? 0), 0);
  const max =
    ((stacked
      ? Math.max(...Array.from({ length: nCats }, (_, i) => catTotal(i)), 0)
      : Math.max(...series.flat(), 0)) || 1) * 1.15;

  const padL = horizontal ? 60 : 34;
  const padB = 26;
  const padT = 10;
  const padR = 10;
  const valAxis = horizontal ? Math.max(10, w - padL - padR) : height - padB - padT;
  const catAxis = horizontal ? height - padT - padB : Math.max(10, w - padL - padR);
  const band = catAxis / nCats;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  // pixel rect for a bar: `cs` = offset along category axis, `thick` = bar thickness,
  // `vStart` = stacked value offset, `vLen` = value length (both in data units).
  const barRect = (cs: number, thick: number, vStart: number, vLen: number) => {
    if (horizontal)
      return {
        x: padL + (vStart / max) * valAxis,
        y: padT + cs,
        width: (vLen / max) * valAxis,
        height: thick,
      };
    return {
      x: padL + cs,
      y: padT + valAxis - ((vStart + vLen) / max) * valAxis,
      width: thick,
      height: (vLen / max) * valAxis,
    };
  };

  const bars: { i: number; r: ReturnType<typeof barRect>; fill: string; active: boolean }[] = [];
  for (let i = 0; i < nCats; i++) {
    const active = hover === i;
    if (stacked) {
      let acc = 0;
      series.forEach((arr, s) => {
        const v = arr[i] ?? 0;
        bars.push({
          i,
          r: barRect(i * band + band * 0.18, band * 0.64, acc, v),
          fill: colorAt(s),
          active,
        });
        acc += v;
      });
    } else {
      const sub = (band * 0.64) / nSeries;
      series.forEach((arr, s) => {
        const v = arr[i] ?? 0;
        bars.push({
          i,
          r: barRect(i * band + band * 0.18 + s * sub, sub * 0.86, 0, v),
          fill: colorAt(s),
          active,
        });
      });
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg width={w} height={height} style={{ display: 'block' }}>
        {ticks.map((f, i) => {
          const p = horizontal ? padL + f * valAxis : padT + valAxis - f * valAxis;
          return (
            <g key={i}>
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
                textAnchor={horizontal ? 'middle' : 'end'}
                fontSize="10"
                fill="var(--text-faint)"
                fontFamily="var(--font-mono)"
              >
                {fmt(Math.round(max * f))}
              </text>
            </g>
          );
        })}
        {bars.map((b, k) => (
          <rect
            key={k}
            x={b.r.x}
            y={b.r.y}
            width={Math.max(0, b.r.width)}
            height={Math.max(0, b.r.height)}
            rx="4"
            fill={b.active ? b.fill : `color-mix(in oklab, ${b.fill} 80%, transparent)`}
            style={{ transition: 'fill .15s' }}
          />
        ))}
        {Array.from({ length: nCats }, (_, i) => {
          const center = i * band + band / 2;
          return (
            <g key={`c${i}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect
                x={horizontal ? padL : padL + i * band}
                y={horizontal ? padT + i * band : padT}
                width={horizontal ? valAxis : band}
                height={horizontal ? band : valAxis}
                fill="transparent"
              />
              {labels?.[i] != null && (
                <text
                  x={horizontal ? padL - 8 : padL + center}
                  y={horizontal ? padT + center + 3.5 : height - 8}
                  textAnchor={horizontal ? 'end' : 'middle'}
                  fontSize="10"
                  fill="var(--text-faint)"
                  fontFamily="var(--font-mono)"
                >
                  {labels[i]}
                </text>
              )}
              {showValues &&
                !stacked &&
                nSeries === 1 &&
                (() => {
                  const v = series[0]![i] ?? 0;
                  const r = barRect(i * band + band * 0.18, band * 0.64, 0, v);
                  return (
                    <text
                      x={horizontal ? r.x + r.width + 4 : r.x + r.width / 2}
                      y={horizontal ? r.y + r.height / 2 + 3.5 : r.y - 4}
                      textAnchor={horizontal ? 'start' : 'middle'}
                      fontSize="10"
                      fill="var(--text-dim)"
                      fontFamily="var(--font-mono)"
                    >
                      {fmt(v)}
                    </text>
                  );
                })()}
            </g>
          );
        })}
      </svg>
      {hover != null && (
        <div
          className="ui-chart-tip"
          style={{
            position: 'absolute',
            left: horizontal ? padL + 8 : padL + hover * band + band / 2,
            top: horizontal ? padT + hover * band + band / 2 : padT + 4,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          {labels?.[hover] != null && <div className="ui-chart-tip-label">{labels[hover]}</div>}
          {series.map((arr, s) => (
            <div key={s} className="ui-chart-tip-row">
              <i style={{ background: colorAt(s) }} />
              {seriesLabels?.[s] && <span>{seriesLabels[s]}</span>}
              <b>{fmt(arr[hover] ?? 0)}</b>
            </div>
          ))}
        </div>
      )}
      {nSeries > 1 && seriesLabels && (
        <div className="ui-chart-legend">
          {seriesLabels.map((lb, s) => (
            <span key={s}>
              <i style={{ background: colorAt(s) }} />
              {lb}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface DonutDatum {
  label: ReactNode;
  value: number;
  color: string;
}

export interface DonutProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  /** Content rendered in the hole (e.g. a total). */
  centerLabel?: ReactNode;
}

export function Donut({ data, size = 168, thickness = 22, centerLabel }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        {centerLabel != null && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
            }}
          >
            {centerLabel}
          </div>
        )}
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="var(--surface-3)"
            strokeWidth={thickness}
          />
          {data.map((d, i) => {
            const len = (d.value / total) * circ;
            const seg = (
              <circle
                key={i}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${len - 2.5} ${circ - len + 2.5}`}
                strokeDashoffset={-acc}
                strokeLinecap="round"
              />
            );
            acc += len;
            return seg;
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5 }}>
            <i
              style={{ width: 9, height: 9, borderRadius: 3, background: d.color, flexShrink: 0 }}
            />
            <span style={{ color: 'var(--text-dim)', flex: 1 }}>{d.label}</span>
            <span className="mono tnum" style={{ fontWeight: 600 }}>
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface StatCardProps {
  icon?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
  delta?: ReactNode;
  deltaDir?: 'up' | 'down';
  spark?: number[];
  sparkColor?: string;
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  deltaDir = 'up',
  spark,
  sparkColor,
}: StatCardProps) {
  const Arrow = deltaDir === 'up' ? Icon.arrowUp : Icon.arrowDown;
  return (
    <div
      className="card card-pad vsp-rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 'var(--r-sm)',
              display: 'grid',
              placeItems: 'center',
              background: 'color-mix(in oklab, var(--accent) 13%, transparent)',
              color: 'var(--accent)',
            }}
          >
            {icon}
          </span>
          <span className="eyebrow">{label}</span>
        </div>
        {delta != null && (
          <span className={`badge ${deltaDir === 'up' ? 'badge-pos' : 'badge-neg'}`}>
            <Arrow style={{ width: 11, height: 11 }} />
            {delta}
          </span>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          className="tnum"
          style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1 }}
        >
          {value}
        </div>
        {spark && <Sparkline data={spark} color={sparkColor ?? 'var(--accent)'} />}
      </div>
    </div>
  );
}
