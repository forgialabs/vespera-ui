import { useState } from 'react';
import { Icon } from '@vespera-ui/icons';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Combobox,
  DatePicker,
  Dialog,
  DropdownMenu,
  Field,
  Input,
  MultiSelect,
  Select,
  Slider,
  Stat,
  Switch,
  Tabs,
  Tag,
  Timeline,
  ToastHost,
  Tooltip,
  fmtDate,
  toast,
  type SelectValue,
} from '@vespera-ui/react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Fig', 'Grape', 'Kiwi', 'Mango', 'Pear'];

export function ButtonExample() {
  return (
    <>
      <Button variant="primary" leadingIcon={<Icon.check />}>
        Save
      </Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="primary" loading>
        Saving…
      </Button>
      <Tooltip label="Notifications">
        <Button variant="ghost" leadingIcon={<Icon.bell />}>
          Hover me
        </Button>
      </Tooltip>
    </>
  );
}

export function BadgeExample() {
  return (
    <>
      <Badge tone="pos" dot>
        Active
      </Badge>
      <Badge tone="neg" dot>
        Failed
      </Badge>
      <Badge tone="warn" dot>
        Pending
      </Badge>
      <Badge tone="info" dot>
        Beta
      </Badge>
      <Badge tone="muted">Draft</Badge>
      <Tag onRemove={() => toast('Removed')}>Removable</Tag>
    </>
  );
}

export function AlertExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 420 }}>
      <Alert tone="info" title="Heads up">
        Your trial ends in 3 days.
      </Alert>
      <Alert tone="pos" title="Saved">
        Your changes are live.
      </Alert>
      <Alert tone="warn" title="Usage high">
        You&apos;re near your API limit.
      </Alert>
    </div>
  );
}

export function SelectExample() {
  const [a, setA] = useState<SelectValue>('Banana');
  const [b, setB] = useState<SelectValue | null>(null);
  const [c, setC] = useState<SelectValue[]>(['Apple', 'Cherry']);
  return (
    <div style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 300 }}>
      <Field label="Select (auto-search ≥8)">
        <Select options={FRUITS} value={a} onChange={setA} />
      </Field>
      <Field label="Combobox (clearable)">
        <Combobox options={FRUITS} value={b} onChange={setB} clearable placeholder="Pick one…" />
      </Field>
      <Field label="Multi-select">
        <MultiSelect options={FRUITS} value={c} onChange={setC} max={4} />
      </Field>
    </div>
  );
}

export function ToggleExample() {
  const [check, setCheck] = useState(true);
  const [on, setOn] = useState(true);
  const [vol, setVol] = useState(60);
  return (
    <div style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 320 }}>
      <Checkbox checked={check} onChange={setCheck} label="Email notifications" sub="Activity updates" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13.5 }}>Two-factor auth</span>
        <Switch checked={on} onChange={setOn} aria-label="Two-factor" />
      </div>
      <Slider value={vol} onChange={setVol} />
    </div>
  );
}

export function TabsExample() {
  const [tab, setTab] = useState('overview');
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Tabs
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity', count: 3 },
          { value: 'settings', label: 'Settings' },
        ]}
        value={tab}
        onChange={setTab}
      />
      <div style={{ padding: '14px 2px', fontSize: 13.5, color: 'var(--text-dim)' }}>
        You are viewing the <strong style={{ color: 'var(--text)' }}>{tab}</strong> tab.
      </div>
    </div>
  );
}

export function OverlayExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <DropdownMenu
        trigger={<Button trailingIcon={<Icon.chevDown />}>Menu</Button>}
        items={[
          { heading: true, label: 'Account' },
          { label: 'Profile', icon: <Icon.user /> },
          { label: 'Settings', icon: <Icon.settings />, kbd: '⌘,' },
          { sep: true },
          { label: 'Log out', icon: <Icon.logout />, danger: true },
        ]}
      />
      <Button onClick={() => toast({ tone: 'pos', title: 'Saved', body: 'Changes are live.' })}>
        Fire a toast
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        tone="neg"
        icon={<Icon.shield />}
        title="Delete workspace?"
        desc="This cannot be undone."
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false);
                toast({ tone: 'neg', title: 'Deleted' });
              }}
            >
              Delete
            </Button>
          </>
        }
      />
      <ToastHost />
    </>
  );
}

export function DataExample() {
  return (
    <div style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 420 }}>
      <Stat icon={<Icon.dollar />} label="Revenue" value="$48,200" delta="12%" deltaDir="up" />
      <Timeline
        items={[
          { title: 'Workspace created', time: '2d ago', tone: 'pos', icon: <Icon.check /> },
          { title: 'Member invited', time: '1d ago', tone: 'info', icon: <Icon.user /> },
          { title: 'Plan upgraded', time: '3h ago', tone: 'warn', icon: <Icon.bolt /> },
        ]}
      />
    </div>
  );
}

export function DatePickerExample() {
  const [d, setD] = useState<Date | null>(null);
  return (
    <div style={{ width: '100%', maxWidth: 260 }}>
      <Field label={`Date${d ? ` · ${fmtDate(d)}` : ''}`}>
        <DatePicker value={d} onChange={setD} />
      </Field>
    </div>
  );
}
