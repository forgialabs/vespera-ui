<script>
  import { portal } from './portal.js';

  let { open = false, groups = [], onclose } = $props();

  let q = $state('');
  let active = $state(0);
  let inputEl = $state();

  const haystack = (it) =>
    [it.label, it.keywords ?? '', it.meta ?? ''].join(' ').toLowerCase();

  let flat = $derived.by(() => {
    const query = q.toLowerCase();
    const out = [];
    for (const g of groups) {
      for (const it of g.items) {
        if (!query || haystack(it).includes(query)) {
          out.push({ ...it, group: g.label, idx: out.length });
        }
      }
    }
    return out;
  });

  let groupOrder = $derived.by(() => {
    const order = [];
    const seen = new Set();
    for (const it of flat) {
      if (!seen.has(it.group)) {
        seen.add(it.group);
        order.push(it.group);
      }
    }
    return order;
  });

  const itemsOf = (g) => flat.filter((it) => it.group === g);

  $effect(() => {
    if (!open) return;
    q = '';
    active = 0;
    const id = setTimeout(() => inputEl?.focus(), 30);
    const onkey = (e) => {
      if (e.key === 'Escape') onclose?.();
    };
    window.addEventListener('keydown', onkey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onkey);
    };
  });

  function run(it) {
    it?.onRun?.();
    onclose?.();
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      active = Math.min(flat.length - 1, active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      active = Math.max(0, active - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(flat[active]);
    }
  }
</script>

{#if open}
  <div
    class="ui-overlay ui-cmd-wrap"
    use:portal
    role="presentation"
    onmousedown={(e) => {
      if (e.target === e.currentTarget) onclose?.();
    }}
  >
    <div class="ui-cmd" role="dialog" aria-modal="true">
      <div class="ui-cmd-input">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          bind:this={inputEl}
          bind:value={q}
          placeholder="Type a command or search…"
          oninput={() => (active = 0)}
          onkeydown={onKey}
        />
        <kbd class="ui-kbd">ESC</kbd>
      </div>
      <div class="ui-cmd-list vsp-scroll">
        {#if flat.length === 0}
          <div
            style="padding:28px 12px;text-align:center;color:var(--text-faint);font-size:13px"
          >
            No results for “{q}”
          </div>
        {/if}
        {#each groupOrder as g (g)}
          <div>
            <div class="ui-cmd-group">{g}</div>
            {#each itemsOf(g) as it (it.idx)}
              <div
                class="ui-cmd-item {it.idx === active ? 'active' : ''}"
                role="option"
                aria-selected={it.idx === active}
                tabindex="-1"
                onmouseenter={() => (active = it.idx)}
                onclick={() => run(it)}
                onkeydown={(e) => e.key === 'Enter' && run(it)}
              >
                {#if it.icon}
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d={it.icon} /></svg
                  >
                {/if}
                <span>{it.label}</span>
                {#if it.meta}<span class="ui-cmd-meta">{it.meta}</span>{/if}
              </div>
            {/each}
          </div>
        {/each}
      </div>
      <div class="ui-cmd-foot">
        <span class="k">
          <kbd class="ui-kbd">↑</kbd>
          <kbd class="ui-kbd">↓</kbd> navigate
        </span>
        <span class="k">
          <kbd class="ui-kbd">↵</kbd> select
        </span>
        <span class="k" style="margin-left:auto">Vespera Command</span>
      </div>
    </div>
  </div>
{/if}
