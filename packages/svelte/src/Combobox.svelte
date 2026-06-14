<script>
  import SelPanel from './SelPanel.svelte';
  import ComboList from './ComboList.svelte';

  let {
    options = [],
    value = $bindable(null),
    placeholder = 'Select…',
    searchPlaceholder = undefined,
    clearable = false,
    disabled = false,
    invalid = false,
    loading = false,
    emptyText = undefined,
    id = undefined,
    name = undefined,
    onchange,
  } = $props();

  let open = $state(false);
  let q = $state('');
  let active = $state(0);
  let anchorEl = $state();

  const normalize = (o) => (typeof o === 'object' ? o : { value: o, label: String(o) });

  let opts = $derived(options.map(normalize));
  let sel = $derived(opts.find((o) => o.value === value));
  let items = $derived(opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())));

  function set(v) {
    value = v;
    onchange?.(v);
  }
  function pick(o) {
    set(o.value);
    open = false;
    q = '';
  }
</script>

<button
  type="button"
  bind:this={anchorEl}
  {id}
  {disabled}
  aria-invalid={invalid || undefined}
  class="ui-trigger {open ? 'open' : ''} {invalid ? 'invalid' : ''}"
  onclick={() => (open = !open)}
>
  <span class="val {sel ? '' : 'ph'}">{sel ? sel.label : placeholder}</span>
  {#if clearable && sel && !disabled}
    <span
      role="button"
      tabindex="-1"
      style="display:grid;place-items:center;color:var(--text-faint)"
      onclick={(e) => {
        e.stopPropagation();
        set(null);
      }}
      onkeydown={(e) => e.key === 'Enter' && set(null)}
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg
      >
    </span>
  {/if}
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
{#if name}
  <input type="hidden" {name} value={value ?? ''} />
{/if}
<SelPanel {open} anchor={anchorEl} onclose={() => (open = false)}>
  <ComboList
    {q}
    {items}
    activeIdx={active}
    isSel={(o) => o.value === value}
    {searchPlaceholder}
    {loading}
    {emptyText}
    onq={(v) => (q = v)}
    onactive={(v) => (active = v)}
    onpick={pick}
  />
</SelPanel>
