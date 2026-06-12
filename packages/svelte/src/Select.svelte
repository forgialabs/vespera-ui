<script>
  import SelPanel from './SelPanel.svelte';
  import ComboList from './ComboList.svelte';

  let {
    options = [],
    value = $bindable(undefined),
    placeholder = 'Select…',
    disabled = false,
    searchable = undefined,
    onchange,
  } = $props();

  let open = $state(false);
  let q = $state('');
  let active = $state(0);
  let anchorEl = $state();

  const normalize = (o) => (typeof o === 'object' ? o : { value: o, label: String(o) });

  let opts = $derived(options.map(normalize));
  let cur = $derived(value ?? opts[0]?.value);
  let sel = $derived(opts.find((o) => String(o.value) === String(cur)));
  let useSearch = $derived(searchable ?? opts.length >= 8);
  let items = $derived(
    useSearch ? opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) : opts,
  );

  function choose(o) {
    value = o.value;
    onchange?.(o.value);
    open = false;
    q = '';
  }
</script>

<button
  type="button"
  bind:this={anchorEl}
  {disabled}
  class="ui-selectbtn {open ? 'open' : ''}"
  onclick={() => (open = !open)}
>
  <span class="val {sel ? '' : 'ph'}">{sel ? sel.label : placeholder}</span>
</button>
<SelPanel {open} anchor={anchorEl} onclose={() => (open = false)}>
  {#if useSearch}
    <ComboList
      {q}
      {items}
      activeIdx={active}
      isSel={(o) => String(o.value) === String(cur)}
      onq={(v) => (q = v)}
      onactive={(v) => (active = v)}
      onpick={choose}
    />
  {:else}
    <div class="ui-combo-list">
      {#if items.length === 0}
        <div class="ui-combo-empty">No options</div>
      {/if}
      {#each items as o (String(o.value))}
        <div
          class="ui-combo-item {String(o.value) === String(cur) ? 'active' : ''}"
          role="option"
          aria-selected={String(o.value) === String(cur)}
          tabindex="-1"
          onclick={() => choose(o)}
          onkeydown={(e) => e.key === 'Enter' && choose(o)}
        >
          {#if o.swatch}
            <span
              style="width:9px;height:9px;border-radius:3px;background:{o.swatch};flex-shrink:0"
            ></span>
          {/if}
          <span>{o.label}</span>
          {#if String(o.value) === String(cur)}
            <svg
              class="tick"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg
            >
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</SelPanel>
