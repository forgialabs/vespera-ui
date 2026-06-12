<script>
  import SelPanel from './SelPanel.svelte';
  import Calendar from './Calendar.svelte';
  import { fmtDate, sameDay } from './dates.js';

  let { value = $bindable(null), placeholder = 'Pick a date', onchange } = $props();

  let open = $state(false);
  let anchorEl = $state();
  const base = value ?? new Date();
  let view = $state({ m: base.getMonth(), y: base.getFullYear() });

  $effect(() => {
    if (open && value) view = { m: value.getMonth(), y: value.getFullYear() };
  });

  function pick(d) {
    value = d;
    onchange?.(d);
    open = false;
  }
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
  <span class="val {value ? '' : 'ph'}">{value ? fmtDate(value) : placeholder}</span>
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
  <Calendar bind:view isSelected={(d) => sameDay(d, value)} onpick={pick} />
</SelPanel>
