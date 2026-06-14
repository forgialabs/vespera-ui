<script>
  import SelPanel from './SelPanel.svelte';
  import Calendar from './Calendar.svelte';
  import { fmtDate, sameDay, matchesDate, nightsBetween } from './dates.js';

  let {
    value = $bindable({ start: null, end: null }),
    placeholder = 'Pick a range',
    min = undefined,
    max = undefined,
    disabled = undefined,
    minNights = undefined,
    maxNights = undefined,
    presets = undefined,
    onchange,
  } = $props();

  let open = $state(false);
  let anchorEl = $state();
  const base = value.start ?? new Date();
  let view = $state({ m: base.getMonth(), y: base.getFullYear() });

  function set(r) {
    value = r;
    onchange?.(r);
  }
  function pick(d) {
    if (!value.start || value.end) set({ start: d, end: null });
    else if (d < value.start) set({ start: d, end: value.start });
    else set({ start: value.start, end: d });
  }
  const inRange = (d) => !!value.start && !!value.end && d > value.start && d < value.end;
  function rangeEnd(d) {
    if (sameDay(d, value.start) && value.end) return 'start';
    if (sameDay(d, value.end)) return 'end';
    return false;
  }
  // While choosing the end, also block days that would violate min/maxNights.
  const isDisabled = (d) => {
    if (matchesDate(d, disabled)) return true;
    if (value.start && !value.end && !sameDay(d, value.start)) {
      const n = nightsBetween(value.start, d);
      if (minNights != null && n < minNights) return true;
      if (maxNights != null && n > maxNights) return true;
    }
    return false;
  };

  let label = $derived(
    value.start
      ? value.end
        ? `${fmtDate(value.start)} – ${fmtDate(value.end)}`
        : `${fmtDate(value.start)} – …`
      : placeholder,
  );
</script>

<button
  type="button"
  bind:this={anchorEl}
  class="ui-trigger {open ? 'open' : ''}"
  onclick={() => (open = !open)}
>
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="color:var(--text-faint);flex-shrink:0"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
  <span class="val {value.start ? '' : 'ph'}">{label}</span>
  <svg
    class="chev"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg
  >
</button>
<SelPanel {open} anchor={anchorEl} auto menuClass="ui-menu" onclose={() => (open = false)}>
  <div class="ui-cal-wrap">
    {#if presets?.length}
      <div class="ui-cal-presets">
        {#each presets as p (p.label)}
          <button
            type="button"
            class="ui-cal-preset {sameDay(p.range.start, value.start) && sameDay(p.range.end, value.end) ? 'on' : ''}"
            onclick={() => set(p.range)}
          >
            {p.label}
          </button>
        {/each}
      </div>
    {/if}
    <Calendar
      bind:view
      {min}
      {max}
      {isDisabled}
      isSelected={(d) => sameDay(d, value.start) || sameDay(d, value.end)}
      isInRange={inRange}
      isRangeEnd={rangeEnd}
      onpick={pick}
    />
  </div>
  <div class="ui-combo-foot">
    <span class="mono" style="font-size:11px;color:var(--text-faint)">
      {#if value.start && value.end}
        {nightsBetween(value.start, value.end) + 1} days
      {:else}
        Select start &amp; end
      {/if}
    </span>
    <div style="flex:1"></div>
    <button type="button" class="btn btn-subtle btn-sm" onclick={() => set({ start: null, end: null })}>
      Clear
    </button>
    <button type="button" class="btn btn-primary btn-sm" onclick={() => (open = false)}>Done</button>
  </div>
</SelPanel>
