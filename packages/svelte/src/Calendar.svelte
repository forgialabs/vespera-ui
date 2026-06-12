<script>
  import { DOW, MONTHS, sameDay, stripTime, monthGrid } from './dates.js';

  let {
    view = $bindable({ m: 0, y: 0 }),
    isSelected = () => false,
    isInRange = undefined,
    isRangeEnd = undefined,
    onpick,
  } = $props();

  let today = stripTime(new Date());
  let days = $derived(monthGrid(view.y, view.m));

  function nav(delta) {
    let m = view.m + delta;
    let y = view.y;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    view = { m, y };
  }

  function dayClass(dt, muted) {
    const sel = isSelected(dt);
    const range = isInRange?.(dt);
    const rEdge = isRangeEnd?.(dt);
    return [
      'ui-cal-day',
      muted && 'muted',
      sameDay(dt, today) && 'today',
      sel && 'sel',
      range && !sel && 'inrange',
      rEdge === 'start' && 'rstart',
      rEdge === 'end' && 'rend',
    ]
      .filter(Boolean)
      .join(' ');
  }
</script>

<div class="ui-cal">
  <div class="ui-cal-head">
    <button type="button" class="ui-cal-nav" aria-label="Previous month" onclick={() => nav(-1)}>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg
      >
    </button>
    <span class="ttl">{MONTHS[view.m]} {view.y}</span>
    <button type="button" class="ui-cal-nav" aria-label="Next month" onclick={() => nav(1)}>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
      >
    </button>
  </div>
  <div class="ui-cal-grid">
    {#each DOW as d (d)}
      <div class="ui-cal-dow">{d}</div>
    {/each}
    {#each days as { dt, muted }, i (i)}
      <button type="button" class={dayClass(dt, muted)} onclick={() => onpick?.(stripTime(dt))}>
        {dt.getDate()}
      </button>
    {/each}
  </div>
</div>
