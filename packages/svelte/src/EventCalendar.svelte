<script>
  import Segmented from './Segmented.svelte';
  import Dialog from './Dialog.svelte';
  import Field from './Field.svelte';
  import Input from './Input.svelte';
  import Select from './Select.svelte';
  import Button from './Button.svelte';
  import { toast } from './toast.svelte.js';
  import { MONTHS } from './dates.js';
  import { untrack } from 'svelte';

  const DOW_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const TONE = {
    info: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
    violet: 'var(--accent-2)',
  };
  const TONE_OPTIONS = [
    { value: 'info', label: 'Blue' },
    { value: 'success', label: 'Green' },
    { value: 'warning', label: 'Amber' },
    { value: 'danger', label: 'Red' },
    { value: 'violet', label: 'Violet' },
  ];
  const DEFAULT_EVENTS = [
    { d: 2, title: 'Q2 board review', tone: 'info', time: '10:00' },
    { d: 5, title: 'Northwind renewal', tone: 'success', time: '09:30' },
    { d: 5, title: 'Webhook deploy', tone: 'warning', time: '14:00' },
    { d: 9, title: 'Payment retry · Cobalt', tone: 'danger', time: '08:00' },
    { d: 12, title: 'Onboarding · Halcyon', tone: 'violet', time: '11:00' },
    { d: 12, title: 'Team sync', tone: 'info', time: '15:30' },
    { d: 12, title: 'Invoice run', tone: 'success', time: '17:00' },
    { d: 18, title: 'Security audit', tone: 'warning', time: '13:00' },
    { d: 21, title: 'Expansion call · Vertex', tone: 'success', time: '10:30' },
    { d: 24, title: 'Quarterly close', tone: 'info', time: 'All day' },
    { d: 24, title: 'Roadmap review', tone: 'violet', time: '16:00' },
    { d: 28, title: 'SLA report due', tone: 'danger', time: '12:00' },
  ];

  let { initialEvents = DEFAULT_EVENTS, onchange } = $props();

  const today = new Date();
  let view = $state('month');
  let segValue = $state('Month');
  let vm = $state({ m: today.getMonth(), y: today.getFullYear() });
  let events = $state(untrack(() => initialEvents.map((e, i) => ({ id: `e${i}`, hour: 9, ...e }))));
  let sel = $state(null);
  let dragging = false;
  let add = $state(null);

  $effect(() => {
    view = segValue.toLowerCase();
  });

  function commit(next) {
    events = next;
    onchange?.(next);
  }
  function nav(delta) {
    let m = vm.m + delta;
    let y = vm.y;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    vm = { m, y };
  }
  function openAdd(days, hour) {
    add = {
      days,
      hour: hour ?? 9,
      title: '',
      tone: 'info',
      time: hour != null ? `${String(hour).padStart(2, '0')}:00` : '10:00',
    };
  }
  function saveAdd() {
    if (!add) return;
    if (!add.title.trim()) {
      add = null;
      return;
    }
    const stamp = Date.now();
    commit([
      ...events,
      ...add.days.map((d, i) => ({
        id: `n${stamp}${i}`,
        d,
        hour: add.hour,
        title: add.title,
        tone: add.tone,
        time: add.time,
      })),
    ]);
    const n = add.days.length;
    add = null;
    toast({ tone: 'pos', title: n > 1 ? `${n} events added` : 'Event added' });
  }

  let evByDay = $derived.by(() => {
    const map = {};
    for (const e of events) (map[e.d] = map[e.d] || []).push(e);
    return map;
  });
  let cells = $derived.by(() => {
    const first = new Date(vm.y, vm.m, 1).getDay();
    const dim = new Date(vm.y, vm.m + 1, 0).getDate();
    const prevDim = new Date(vm.y, vm.m, 0).getDate();
    const out = [];
    for (let i = first - 1; i >= 0; i--) out.push({ day: prevDim - i, muted: true });
    for (let d = 1; d <= dim; d++) out.push({ day: d });
    while (out.length % 7) out.push({ day: out.length - (first + dim) + 1, muted: true });
    return out;
  });
  let weekDays = $derived.by(() => {
    const d0 = new Date(vm.y, vm.m, today.getDate() - today.getDay());
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(d0);
      d.setDate(d0.getDate() + i);
      out.push(d);
    }
    return out;
  });
  let agendaDays = $derived(
    Object.keys(evByDay)
      .map(Number)
      .sort((a, b) => a - b),
  );
  const HOURS = [];
  for (let h = 8; h <= 18; h++) HOURS.push(h);

  const isToday = (d, muted) =>
    !muted && d === today.getDate() && vm.m === today.getMonth() && vm.y === today.getFullYear();
  const inSel = (d) => sel && d >= Math.min(sel.a, sel.b) && d <= Math.max(sel.a, sel.b);
  const cellClass = (c) =>
    ['ui-cb-cell', c.muted && 'muted', !c.muted && inSel(c.day) && 'sel'].filter(Boolean).join(' ');
  const apptAt = (d, h) =>
    events.find((e) => e.d === d.getDate() && e.hour === h && d.getMonth() === vm.m);
  const sortedDay = (day) => evByDay[day].slice().sort((a, b) => a.hour - b.hour);

  function cellDown(c) {
    if (!c.muted) {
      dragging = true;
      sel = { a: c.day, b: c.day };
    }
  }
  function cellEnter(c) {
    if (dragging && !c.muted) sel = sel ? { a: sel.a, b: c.day } : sel;
  }
  function cellUp(c) {
    if (dragging && sel) {
      dragging = false;
      const lo = Math.min(sel.a, c.day);
      const hi = Math.max(sel.a, c.day);
      const days = [];
      for (let d = lo; d <= hi; d++) days.push(d);
      openAdd(days);
      sel = null;
    }
  }
</script>

<div class="ui-cb">
  <div class="ui-cb-head">
    <div style="display:flex;gap:4px">
      <button
        type="button"
        class="vsp-icon-btn"
        style="width:32px;height:32px"
        aria-label="Previous month"
        onclick={() => nav(-1)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        type="button"
        class="vsp-icon-btn"
        style="width:32px;height:32px"
        aria-label="Next month"
        onclick={() => nav(1)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
    <div class="ui-cb-title">{MONTHS[vm.m]} {vm.y}</div>
    <button
      type="button"
      class="btn btn-ghost btn-sm"
      onclick={() => (vm = { m: today.getMonth(), y: today.getFullYear() })}
    >
      Today
    </button>
    <div style="flex:1"></div>
    <Segmented bind:value={segValue} options={['Month', 'Week', 'Agenda']} />
    <button type="button" class="btn btn-primary btn-sm" onclick={() => openAdd([today.getDate()])}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      Event
    </button>
  </div>

  {#if view === 'month'}
    <div class="ui-cb-grid">
      {#each DOW_FULL as d (d)}
        <div class="ui-cb-dow">{d}</div>
      {/each}
    </div>
    <div
      class="ui-cb-grid"
      role="grid"
      tabindex="-1"
      onmouseleave={() => {
        if (!dragging) sel = null;
      }}
    >
      {#each cells as c, i (i)}
        {@const evs = c.muted ? [] : evByDay[c.day] || []}
        <div
          class={cellClass(c)}
          role="gridcell"
          tabindex="-1"
          style={i >= cells.length - 7 ? 'border-bottom:0' : ''}
          onmousedown={() => cellDown(c)}
          onmouseenter={() => cellEnter(c)}
          onmouseup={() => cellUp(c)}
        >
          <span class="ui-cb-date {isToday(c.day, c.muted) ? 'today' : ''}">{c.day}</span>
          {#each evs.slice(0, 3) as e (e.id)}
            <div
              class="ui-cb-event"
              style="color:{TONE[e.tone]};background:color-mix(in oklab, {TONE[e.tone]} 14%, transparent)"
            >
              <i></i>{e.title}
            </div>
          {/each}
          {#if evs.length > 3}
            <span class="ui-cb-more">+{evs.length - 3} more</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if view === 'week'}
    <div class="ui-cb-week" style="max-height:420px;overflow-y:auto">
      <div class="ui-cb-wk-corner"></div>
      {#each weekDays as d, i (i)}
        <div class="ui-cb-wk-dh">
          <div class="eyebrow">{DOW_FULL[d.getDay()]}</div>
          <div
            style="font-weight:700;font-size:15px;color:{d.getDate() === today.getDate()
              ? 'var(--accent)'
              : 'var(--text)'}"
          >
            {d.getDate()}
          </div>
        </div>
      {/each}
      {#each HOURS as h (h)}
        <div class="ui-cb-wk-hr">{String(h).padStart(2, '0')}:00</div>
        {#each weekDays as d, i (i)}
          {@const appt = apptAt(d, h)}
          <div
            class="ui-cb-slot"
            role="button"
            tabindex="-1"
            onclick={() => !appt && openAdd([d.getDate()], h)}
            onkeydown={(e) => e.key === 'Enter' && !appt && openAdd([d.getDate()], h)}
          >
            {#if appt}
              <div
                class="ui-cb-appt"
                style="color:{TONE[appt.tone]};background:color-mix(in oklab, {TONE[
                  appt.tone
                ]} 18%, transparent)"
              >
                {appt.title}
              </div>
            {/if}
          </div>
        {/each}
      {/each}
    </div>
  {/if}

  {#if view === 'agenda'}
    <div>
      {#each agendaDays as day (day)}
        <div class="ui-cb-agenda-day">
          <div style="width:56px;flex-shrink:0;text-align:center">
            <div class="eyebrow">{DOW_FULL[new Date(vm.y, vm.m, day).getDay()]}</div>
            <div class="tnum" style="font-size:22px;font-weight:800;line-height:1.1">{day}</div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:8px">
            {#each sortedDay(day) as e (e.id)}
              <div style="display:flex;align-items:center;gap:10px">
                <span
                  style="width:8px;height:8px;border-radius:99px;background:{TONE[e.tone]};flex-shrink:0"
                ></span>
                <span style="font-weight:600;font-size:13.5px">{e.title}</span>
                <span class="mono" style="margin-left:auto;font-size:11.5px;color:var(--text-faint)"
                  >{e.time}</span
                >
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <Dialog
    open={!!add}
    maxWidth={420}
    title={add && add.days.length > 1 ? `New event · ${add.days.length} days` : 'New event'}
    desc={add
      ? `${MONTHS[vm.m]} ${add.days[0]}${
          add.days.length > 1 ? `–${add.days[add.days.length - 1]}` : ''
        }, ${vm.y}`
      : ''}
    onclose={() => (add = null)}
  >
    {#snippet icon()}
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
    {/snippet}
    {#if add}
      <div style="display:grid;gap:14px">
        <Field label="Title" required>
          <Input bind:value={add.title} placeholder="Meeting, review, booking…" />
        </Field>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <Field label="Time">
            <Input bind:value={add.time} />
          </Field>
          <Field label="Color">
            <Select bind:value={add.tone} options={TONE_OPTIONS} />
          </Field>
        </div>
      </div>
    {/if}
    {#snippet footer()}
      <Button variant="ghost" size="sm" onclick={() => (add = null)}>Cancel</Button>
      <Button variant="primary" size="sm" onclick={saveAdd}>Add event</Button>
    {/snippet}
  </Dialog>
</div>
