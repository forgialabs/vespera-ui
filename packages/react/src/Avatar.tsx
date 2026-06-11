export interface AvatarProps {
  name: string;
  /** Hue (0–360) for the generated gradient. */
  hue?: number;
  size?: number;
}

export function Avatar({ name, hue = 0, size = 34 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      className="vsp-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(140deg, oklch(0.62 0.16 ${hue}), oklch(0.55 0.17 ${(hue + 50) % 360}))`,
      }}
    >
      {initials}
    </span>
  );
}

export interface AvatarPerson {
  name: string;
  hue?: number;
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
          <Avatar name={p.name} hue={p.hue} size={size} />
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
