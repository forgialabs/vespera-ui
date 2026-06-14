<script>
  let {
    value = $bindable([]),
    placeholder = 'Type and press Enter…',
    disabled = false,
    invalid = false,
    max = undefined,
    id = undefined,
    onchange,
  } = $props();

  let draft = $state('');
  let rootEl = $state();
  let full = $derived(max != null && value.length >= max);

  function set(next) {
    value = next;
    onchange?.(next);
  }
  function add() {
    const t = draft.trim();
    if (t && !value.includes(t) && !full) set([...value, t]);
    draft = '';
  }
  function onKey(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && value.length) {
      set(value.slice(0, -1));
    }
  }
</script>

<div
  bind:this={rootEl}
  class="ui-trigger{invalid ? ' invalid' : ''}{disabled ? ' disabled' : ''}"
  role="presentation"
  aria-invalid={invalid || undefined}
  style="cursor:{disabled
    ? 'not-allowed'
    : 'text'};flex-wrap:wrap;align-items:center;gap:6px;padding-top:5px;padding-bottom:5px"
  onclick={() => !disabled && rootEl?.querySelector('input')?.focus()}
>
  {#each value as t (t)}
    <span class="ui-tag" style="max-width:100%">
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{t}</span>
      <button type="button" aria-label="Remove {t}" onclick={() => set(value.filter((v) => v !== t))}>
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
  <input
    {id}
    bind:value={draft}
    disabled={disabled || full}
    placeholder={value.length ? '' : placeholder}
    onkeydown={onKey}
    onblur={add}
    style="flex:1 1 80px;min-width:80px;border:0;background:transparent;outline:none;font:inherit;font-size:13.5px;color:var(--text)"
  />
</div>
