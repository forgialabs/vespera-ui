'use client';
import { useState, type CSSProperties } from 'react';
import { Icon } from '@vespera-ui/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHead,
  Checkbox,
  Combobox,
  Dialog,
  Divider,
  DropdownMenu,
  Field,
  IconButton,
  Input,
  Kbd,
  MultiSelect,
  Progress,
  RadioGroup,
  Select,
  Slider,
  Stepper,
  Switch,
  Tabs,
  Tag,
  Textarea,
  ToastHost,
  TokenInput,
  toast,
  type SelectValue,
} from '@vespera-ui/react';

const ACCENTS = ['#4a7cff', '#1fb574', '#b16cff', '#ff7a6b', '#f5a524', '#16b6c9'];
const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Kiwi', 'Mango'];

export function Playground() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accent, setAccent] = useState('#4a7cff');
  const [density, setDensity] = useState('comfortable');
  const [corners, setCorners] = useState('round');

  const [emails, setEmails] = useState(true);
  const [digest, setDigest] = useState(false);
  const [twoFa, setTwoFa] = useState(true);
  const [volume, setVolume] = useState(64);
  const [plan, setPlan] = useState('Monthly');
  const [selectVal, setSelectVal] = useState<SelectValue>('Banana');
  const [combo, setCombo] = useState<SelectValue | null>(null);
  const [multi, setMulti] = useState<SelectValue[]>(['Apple', 'Cherry']);
  const [tokens, setTokens] = useState<string[]>(['design', 'frontend']);
  const [tab, setTab] = useState('overview');
  const [dialog, setDialog] = useState(false);

  return (
    <div
      className="vsp-root"
      data-theme={theme}
      data-density={density}
      data-corners={corners}
      data-bganim="on"
      style={{ '--accent': accent, '--bg-accent': accent } as CSSProperties}
    >
      <div className="vsp-bg">
        <b />
        <b />
        <b />
      </div>

      <div className="wrap">
        <header className="demo-head">
          <div
            className="vsp-brand-mark"
            style={{ width: 38, height: 38, borderRadius: 11 }}
          />
          <div>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: '-0.02em' }}>Vespera</h1>
            <div className="eyebrow">interactive playground · @vespera-ui/react</div>
          </div>
          <div style={{ flex: 1 }} />
          <Badge tone="info" dot>
            live
          </Badge>
          <IconButton
            icon={theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
            label="Toggle theme"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          />
        </header>

        {/* live theming controls */}
        <div className="demo-controls">
          <span className="eyebrow">accent</span>
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              className={'swatch' + (a === accent ? ' on' : '')}
              style={{ background: a }}
              aria-label={`accent ${a}`}
              onClick={() => setAccent(a)}
            />
          ))}
          <div className="sep" />
          <span className="eyebrow">density</span>
          <Tabs
            tabs={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'spacious', label: 'Spacious' },
            ]}
            value={density}
            onChange={setDensity}
          />
          <div className="sep" />
          <span className="eyebrow">corners</span>
          <Tabs
            tabs={[
              { value: 'sharp', label: 'Sharp' },
              { value: 'soft', label: 'Soft' },
              { value: 'round', label: 'Round' },
            ]}
            value={corners}
            onChange={setCorners}
          />
        </div>

        <div className="grid2">
          {/* Buttons → toasts */}
          <Card>
            <CardHead title="Buttons" desc="click for a toast" />
            <div className="card-pad stack">
              <div className="row">
                <Button
                  variant="primary"
                  leadingIcon={<Icon.check />}
                  onClick={() => toast({ tone: 'pos', title: 'Saved', body: 'Your changes are live.' })}
                >
                  Save
                </Button>
                <Button variant="ghost" onClick={() => toast('Hello from Vespera')}>
                  Ghost
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast({ tone: 'neg', title: 'Deleted', body: 'The item was removed.' })}
                >
                  Delete
                </Button>
                <DropdownMenu
                  trigger={<Button trailingIcon={<Icon.chevDown />}>Menu</Button>}
                  items={[
                    { heading: true, label: 'Account' },
                    { label: 'Profile', icon: <Icon.user />, onClick: () => toast('Profile') },
                    { label: 'Settings', icon: <Icon.settings />, kbd: '⌘,' },
                    { sep: true },
                    { label: 'Log out', icon: <Icon.logout />, danger: true },
                  ]}
                />
              </div>
              <div className="row">
                <Button variant="primary" loading>
                  Saving…
                </Button>
                <Button variant="primary" onClick={() => setDialog(true)}>
                  Open dialog
                </Button>
                <Kbd>⌘K</Kbd>
              </div>
            </div>
          </Card>

          {/* Selects */}
          <Card>
            <CardHead title="Selects" desc="searchable, themed" />
            <div className="card-pad stack">
              <Field label="Fruit (auto-search ≥8)">
                <Select options={FRUITS} value={selectVal} onChange={setSelectVal} />
              </Field>
              <Field label="Combobox (clearable)">
                <Combobox
                  options={FRUITS}
                  value={combo}
                  onChange={setCombo}
                  clearable
                  placeholder="Pick one…"
                />
              </Field>
              <Field label="Multi-select">
                <MultiSelect options={FRUITS} value={multi} onChange={setMulti} max={5} />
              </Field>
              <Field label="Tags">
                <TokenInput value={tokens} onChange={setTokens} />
              </Field>
            </div>
          </Card>

          {/* Toggles */}
          <Card>
            <CardHead title="Selection & toggles" />
            <div className="card-pad stack">
              <Checkbox
                checked={emails}
                onChange={setEmails}
                label="Email notifications"
                sub="Get notified about activity"
              />
              <Checkbox checked={digest} onChange={setDigest} label="Weekly digest" />
              <Divider />
              <RadioGroup
                value={plan}
                onChange={setPlan}
                options={[
                  { value: 'Monthly', label: 'Monthly' },
                  { value: 'Annual', label: 'Annual — save 20%' },
                ]}
              />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13.5 }}>Two-factor auth</span>
                <Switch checked={twoFa} onChange={setTwoFa} aria-label="Two-factor auth" />
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Volume · {volume}
                </div>
                <Slider value={volume} onChange={setVolume} />
              </div>
            </div>
          </Card>

          {/* Feedback + data */}
          <Card>
            <CardHead title="Feedback & data" />
            <div className="card-pad stack">
              <Tabs
                tabs={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'activity', label: 'Activity', count: 3 },
                  { value: 'settings', label: 'Settings' },
                ]}
                value={tab}
                onChange={setTab}
              />
              {tab === 'overview' && (
                <Alert tone="info" title="Heads up">
                  Your trial ends in 3 days.
                </Alert>
              )}
              {tab === 'activity' && (
                <Alert tone="pos" title="All caught up">
                  No new alerts.
                </Alert>
              )}
              {tab === 'settings' && (
                <Field label="Workspace name">
                  <Input defaultValue="Vespera" />
                </Field>
              )}
              <Stepper steps={['Account', 'Profile', 'Done']} current={1} />
              <div className="row">
                <Badge tone="pos" dot>
                  Active
                </Badge>
                <Badge tone="warn" dot>
                  Trial
                </Badge>
                <Tag onRemove={() => toast('Removed tag')}>Removable</Tag>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>
                  Storage · 64%
                </div>
                <Progress value={64} />
              </div>
              <Textarea placeholder="Leave a note…" />
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        tone="neg"
        icon={<Icon.shield />}
        title="Delete workspace?"
        desc="This permanently removes the workspace and all of its data."
        footer={
          <>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                setDialog(false);
                toast({ tone: 'neg', title: 'Workspace deleted' });
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <ToastHost />
    </div>
  );
}