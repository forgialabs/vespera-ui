'use client';
import { useState } from 'react';
import { Icon } from '@vespera-ui/icons';
import {
  Accordion,
  AreaChart,
  AvatarGroup,
  BarChart,
  Banner,
  Breadcrumb,
  Button,
  Card,
  CircularProgress,
  CommandPalette,
  CopyButton,
  DateRangePicker,
  Donut,
  EmptyState,
  EventCalendar,
  InlineEdit,
  NumberStepper,
  OTPInput,
  Pagination,
  Popover,
  Progress,
  Sheet,
  Sparkline,
  Spinner,
  Stepper,
  ToastHost,
  Tree,
  useCmdK,
  type DateRange,
} from '@vespera-ui/react';

const revenue = [12, 18, 15, 22, 19, 26, 24, 31, 28, 35, 33, 42];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ChartsExample() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%' }}>
      <Card pad>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Revenue · area</div>
        <AreaChart series={[revenue]} labels={months} height={200} />
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card pad>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Signups · grouped + tooltip</div>
          <BarChart
            data={[
              [40, 65, 52, 78, 61, 90, 72],
              [28, 41, 39, 52, 44, 60, 51],
            ]}
            labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
            seriesLabels={['New', 'Returning']}
            valueFormat={(n) => `${n}`}
            height={170}
          />
        </Card>
        <Card pad>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Channels · donut</div>
          <Donut
            data={[
              { label: 'Organic', value: 48, color: 'var(--accent)' },
              { label: 'Referral', value: 30, color: 'var(--accent-2)' },
              { label: 'Direct', value: 22, color: 'var(--success)' },
            ]}
            size={132}
          />
        </Card>
      </div>
      <Card pad>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Plan mix · horizontal stacked</div>
        <BarChart
          data={[
            [42, 38, 30, 22],
            [30, 26, 33, 28],
            [12, 18, 20, 25],
          ]}
          labels={['Q1', 'Q2', 'Q3', 'Q4']}
          seriesLabels={['Free', 'Pro', 'Team']}
          horizontal
          stacked
          height={180}
        />
      </Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="eyebrow">Sparkline</span>
        <Sparkline data={revenue} />
      </div>
    </div>
  );
}

export function FeedbackExample() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      <div style={{ width: 200 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Progress · 64%</div>
        <Progress value={64} />
      </div>
      <CircularProgress value={72} />
      <Spinner size="lg" />
      <Stepper steps={['Account', 'Profile', 'Done']} current={1} />
    </div>
  );
}

export function StructureExample() {
  return (
    <div style={{ display: 'grid', gap: 18, width: '100%', maxWidth: 460 }}>
      <Accordion
        items={[
          { title: 'What is Vespera?', body: 'A deep-space, weightless design system.' },
          { title: 'Is it free?', body: 'Yes — Apache-2.0.' },
          { title: 'Which frameworks?', body: 'React today; the CSS works anywhere.' },
        ]}
        defaultOpen={[0]}
      />
      <Tree
        data={[
          {
            label: 'src',
            children: [
              { label: 'components', children: [{ label: 'Button.tsx', badge: 'tsx' }, { label: 'Card.tsx', badge: 'tsx' }] },
              { label: 'index.ts', badge: 'ts' },
            ],
          },
          { label: 'package.json' },
        ]}
        defaultExpanded={['src']}
      />
    </div>
  );
}

export function CommandExample() {
  const [open, setOpen] = useState(false);
  useCmdK(setOpen);
  return (
    <>
      <Button leadingIcon={<Icon.search />} onClick={() => setOpen(true)}>
        Open ⌘K
      </Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={[
          {
            label: 'Actions',
            items: [
              { label: 'New project', icon: <Icon.plus />, meta: '⌘N' },
              { label: 'Search docs', icon: <Icon.doc />, keywords: 'help' },
            ],
          },
          {
            label: 'Navigation',
            items: [
              { label: 'Dashboard', icon: <Icon.grid /> },
              { label: 'Settings', icon: <Icon.settings /> },
            ],
          },
        ]}
      />
    </>
  );
}

export function SheetExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open sheet
      </Button>
      <Popover trigger={<Button>Popover</Button>}>
        <div style={{ fontSize: 13 }}>Anything fits in a popover — text, forms, menus.</div>
      </Popover>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        icon={<Icon.settings />}
        title="Settings"
        desc="Manage your workspace."
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        }
      >
        <div style={{ fontSize: 13.5, color: 'var(--text-dim)' }}>Drawer content goes here.</div>
      </Sheet>
    </>
  );
}

export function DateRangeExample() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const at = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  };
  const presets = [
    { label: 'Last 7 days', range: { start: at(-6), end: at(0) } },
    { label: 'Last 30 days', range: { start: at(-29), end: at(0) } },
    { label: 'Next 14 days', range: { start: at(0), end: at(13) } },
  ];
  return (
    <div style={{ width: 360 }}>
      <DateRangePicker value={range} onChange={setRange} presets={presets} maxNights={30} />
    </div>
  );
}

export function EventCalendarExample() {
  return (
    <div style={{ width: '100%' }}>
      <EventCalendar />
      <ToastHost />
    </div>
  );
}

export function NavExample() {
  const [page, setPage] = useState(2);
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <Breadcrumb items={['Home', 'Projects', 'Vespera']} />
      <Pagination page={page} pages={8} onPage={setPage} />
    </div>
  );
}

export function MessagingExample() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 460 }}>
      <Banner tone="accent" action={<Button size="sm">Upgrade</Button>} onDismiss={() => {}}>
        You&apos;re on the free plan — upgrade for more.
      </Banner>
      <Card>
        <EmptyState
          icon={<Icon.inbox />}
          title="No messages"
          desc="When you get messages, they'll show up here."
          action={<Button variant="primary">Compose</Button>}
          compact
        />
      </Card>
    </div>
  );
}

export function MoreFormsExample() {
  const [qty, setQty] = useState(2);
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('Vespera');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <NumberStepper value={qty} onChange={setQty} min={0} max={10} />
        <InlineEdit value={name} onSave={setName} />
        <CopyButton text="npm i @vespera-ui/react" label="Copy install" />
      </div>
      <OTPInput value={otp} onChange={setOtp} length={6} />
    </div>
  );
}

export function AvatarExample() {
  return (
    <AvatarGroup
      people={[
        { name: 'Ada Lovelace', hue: 220 },
        { name: 'Alan Turing', hue: 160 },
        { name: 'Grace Hopper', hue: 300 },
        { name: 'Linus T', hue: 40 },
        { name: 'Margaret H', hue: 0 },
      ]}
      max={4}
      size={40}
    />
  );
}