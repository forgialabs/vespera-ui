<script>
  import SelPanel from './SelPanel.svelte';
  import ComboList from './ComboList.svelte';

  let {
    options = [],
    value = $bindable([]),
    placeholder = 'Select…',
    searchPlaceholder = undefined,
    max = undefined,
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
  let items = $derived(opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())));
  let selOpts = $derived(opts.filter((o) => value.includes(o.value)));

  const has = (v) => value.includes(v);
  function set(next) {
    value = next;
    onchange?.(next);
  }
  function toggle(o) {
    if (has(o.value)) set(value.filter((v) => v !== o.value));
    else if (!max || value.length < max) set([...value, o.value]);
  }
</script>

<div
  role="button"
  tabindex={disabled ? -1 : 0}
  bind:this={anchorEl}
  {id}
  aria-disabled={disabled || undefined}
  aria-invalid={invalid || undefined}
  class="ui-trigger {open ? 'open' : ''} {invalid ? 'invalid' : ''} {disabled ? 'disabled' : ''}"
  style="min-height:var(--ctrl-h)"
  onclick={() => !disabled && (open = !open)}
  onkeydown={(e) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      open = !open;
    }
  }}
>
  {#if selOpts.length === 0}
    <span class="val ph">{placeholder}</span>
  {:else}
    <span class="tags">
      {#each selOpts as o (String(o.value))}
        <span class="ui-tag" role="presentation" onclick={(e) => e.stopPropagation()}>
          {o.label}
          <button
            type="button"
            aria-label="Remove {o.label}"
            onclick={() => set(value.filter((v) => v !== o.value))}
          >
            <svg
              viewBox="0 0 24 24"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg
            >
          </button>
        </span>
      {/each}
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
</div>
{#if name}
  {#each value as v (String(v))}
    <input type="hidden" {name} value={v} />
  {/each}
{/if}
<SelPanel {open} anchor={anchorEl} onclose={() => (open = false)}>
  <ComboList
    {q}
    {items}
    activeIdx={active}
    isSel={(o) => has(o.value)}
    {searchPlaceholder}
    {loading}
    {emptyText}
    onq={(v) => (q = v)}
    onactive={(v) => (active = v)}
    onpick={toggle}
  >
    {#snippet footer()}
      <div class="ui-combo-foot">
        <span class="mono" style="font-size:11px;color:var(--text-faint)">
          {value.length} selected{max ? ` / ${max}` : ''}
        </span>
        <div style="flex:1"></div>
        {#if value.length > 0}
          <button type="button" class="btn btn-subtle btn-sm" onclick={() => set([])}>Clear</button>
        {/if}
      </div>
    {/snippet}
  </ComboList>
</SelPanel>
