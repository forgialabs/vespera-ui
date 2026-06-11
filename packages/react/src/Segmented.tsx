import { cx } from './cx';

export interface SegmentedProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="ui-seg">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={cx(value === o && 'on')}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
