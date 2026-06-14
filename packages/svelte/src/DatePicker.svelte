<script>
  import SelPanel from './SelPanel.svelte';
  import Calendar from './Calendar.svelte';
  import { fmtDate, sameDay, matchesDate } from './dates.js';

  let {
    value = $bindable(null),
    placeholder = 'Pick a date',
    min = undefined,
    max = undefined,
    disabled = undefined,
    multiple = false,
    values = $bindable([]),
    onchange,
    onvalueschange,
  } = $props();

  let open = $state(false);
  let anchorEl = $state();
  const seed = (multiple ? values[values.length - 1] : value) ?? new Date();
  let view = $state({ m: seed.getMonth(), y: seed.getFullYear() });

  $effect(() => {
    const v = multiple ? values[values.length - 1] : value;
    if (open && v) view = { m: v.getMonth(), y: v.getFullYear() };
  });

  const isDisabled = (d) => matchesDate(d, disabled);
  let label = $derived(
    multiple
      ? values.length
        ? values.length === 1
          ? fmtDate(values[0])
          : `${values.length} dates`
        : placeholder
      : value
        ? fmtDate(value)
        : placeholder,
  );
  let empty = $derived(multiple ? !values.length : !value);

  function pick(d) {
    if (multiple) {
      const exists = values.some((x) => sameDay(x, d));
      values = exists
        ? values.filter((x) => !sameDay(x, d))
        : [...values, d].sort((a, b) => a.getTime() - b.getTime());
      onvalueschange?.(values);
    } else {
      value = d;
      onchange?.(d);
      open = false;
    }
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
  <span class="val {empty ? 'ph' : ''}">{label}</span>
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
  <Calendar
    bind:view
    {min}
    {max}
    {isDisabled}
    isSelected={(d) =>
      multiple ? values.some((x) => sameDay(x, d)) : sameDay(d, value)}
    onpick={pick}
  />
  {#if multiple}
    <div class="ui-combo-foot">
      <span class="mono" style="font-size:11px;color:var(--text-faint)">
        {values.length ? `${values.length} selected` : 'Select dates'}
      </span>
      <div style="flex:1"></div>
      <button
        type="button"
        class="btn btn-subtle btn-sm"
        onclick={() => {
          values = [];
          onvalueschange?.(values);
        }}
      >
        Clear
      </button>
      <button type="button" class="btn btn-primary btn-sm" onclick={() => (open = false)}>Done</button>
    </div>
  {/if}
</SelPanel>
