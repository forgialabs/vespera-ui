export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: 'var(--success)',
  offline: 'var(--text-faint)',
  away: 'var(--warning)',
  busy: 'var(--danger)',
};

export interface AvatarProps {
  name: string;
  /** Hue (0–360) for the generated gradient (used when there's no `src`). */
  hue?: number;
  size?: number;
  /** Image URL — falls back to initials if omitted. */
  src?: string;
  /** Alt text for the image (defaults to `name`). */
  alt?: string;
  /** Presence indicator dot. */
  status?: AvatarStatus;
  shape?: 'circle' | 'square';
}

export function Avatar({
  name,
  hue = 0,
  size = 34,
  src,
  alt,
  status,
  shape = 'circle',
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const radius = shape === 'square' ? 'var(--r-sm)' : '50%';
  const dot = Math.max(8, Math.round(size * 0.28));
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <span
        className="vsp-avatar"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.38,
          borderRadius: radius,
          overflow: 'hidden',
          background: src
            ? 'var(--surface-3)'
            : `linear-gradient(140deg, oklch(0.62 0.16 ${hue}), oklch(0.55 0.17 ${(hue + 50) % 360}))`,
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt ?? name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          initials
        )}
      </span>
      {status && (
        <span
          aria-label={status}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: dot,
            height: dot,
            borderRadius: '50%',
            background: STATUS_COLOR[status],
            border: '2px solid var(--surface-1)',
          }}
        />
      )}
    </span>
  );
}

export interface AvatarPerson {
  name: string;
  hue?: number;
  src?: string;
}

export interface AvatarGroupProps {
  people: AvatarPerson[];
  max?: number;
  size?: number;
}

export function AvatarGroup({ people, max = 4, size = 32 }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <span
          key={i}
          style={{
            marginLeft: i ? -10 : 0,
            border: '2px solid var(--surface-1)',
            borderRadius: '50%',
            position: 'relative',
            zIndex: shown.length - i,
          }}
        >
          <Avatar name={p.name} hue={p.hue} src={p.src} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span
          style={{
            marginLeft: -10,
            width: size,
            height: size,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: 'var(--surface-3)',
            border: '2px solid var(--surface-1)',
            fontSize: size * 0.34,
            fontWeight: 700,
            color: 'var(--text-dim)',
          }}
        >
          +{extra}
        </span>
      )}
    </div>
  );
}
