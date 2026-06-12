<script>
  import Block from './Block.svelte';
  import Badge from './Badge.svelte';
  import Avatar from './Avatar.svelte';
  import { portal } from './portal.js';
  import { untrack } from 'svelte';

  const DEFAULT_COLUMNS = [
    {
      name: 'Triage',
      tone: 'var(--text-faint)',
      cards: [
        { id: 'k1', title: 'Cobalt payment failed', tag: 'Billing', tone: 'neg' },
        { id: 'k2', title: 'Verify SSO config', tag: 'Security', tone: 'warn' },
      ],
    },
    {
      name: 'In progress',
      tone: 'var(--accent)',
      cards: [
        { id: 'k3', title: 'Migrate Halcyon seats', tag: 'Accounts', tone: 'info' },
        { id: 'k4', title: 'Q2 expansion review', tag: 'Revenue', tone: 'info' },
        { id: 'k5', title: 'Webhook retry logic', tag: 'Product', tone: 'warn' },
      ],
    },
    {
      name: 'Done',
      tone: 'var(--success)',
      cards: [
        { id: 'k6', title: 'Ship usage billing', tag: 'Product', tone: 'pos' },
        { id: 'k7', title: 'Reconcile invoices', tag: 'Finance', tone: 'pos' },
      ],
    },
  ];

  let { columns = DEFAULT_COLUMNS, onchange } = $props();

  let cols = $state(untrack(() => columns.map((c) => ({ ...c, cards: [...c.cards] }))));
  let drag = $state(null);
  let pt = $state({ x: 0, y: 0 });
  let target = $state(null);
  let colEls = [];
  let dragData = null;
  let targetData = null;

  function startDrag(e, card, ci) {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const origIndex = cols[ci].cards.findIndex((c) => c.id === card.id);
    const d = {
      card,
      from: ci,
      origIndex,
      w: rect.width,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
    };
    const home = { col: ci, index: origIndex };
    dragData = d;
    targetData = home;
    drag = d;
    pt = { x: e.clientX, y: e.clientY };
    target = home;
    e.preventDefault();
  }

  $effect(() => {
    if (!drag) return;
    const d = drag;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    const move = (e) => {
      pt = { x: e.clientX, y: e.clientY };
      let found = null;
      colEls.forEach((el, ci) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top - 60 &&
          e.clientY <= r.bottom + 80
        ) {
          const cards = Array.from(el.querySelectorAll('[data-kcard]'));
          let idx = cards.length;
          for (let i = 0; i < cards.length; i++) {
            const cr = cards[i].getBoundingClientRect();
            if (e.clientY < cr.top + cr.height / 2) {
              idx = i;
              break;
            }
          }
          found = { col: ci, index: idx };
        }
      });
      if (!found) found = { col: d.from, index: d.origIndex };
      targetData = found;
      target = found;
    };
    const up = () => {
      const dd = dragData;
      const tg = targetData;
      if (dd && tg) {
        const next = cols.map((c) => ({ ...c, cards: c.cards.filter((x) => x.id !== dd.card.id) }));
        next[tg.col].cards.splice(tg.index, 0, dd.card);
        cols = next;
        onchange?.(next);
      }
      dragData = null;
      targetData = null;
      drag = null;
      target = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  });

  const itemsOf = (col) => col.cards.filter((c) => !(drag && c.id === drag.card.id));
  const showPhIn = (ci) => !!drag && !!target && target.col === ci;
</script>

<Block
  title="Operations board"
  desc="A lightweight kanban — drag a card to reorder it or move it between columns."
>
  <div style="padding:14px;display:grid;grid-template-columns:repeat(3, 1fr);gap:16px">
    {#each cols as col, ci (col.name)}
      {@const items = itemsOf(col)}
      {@const showPh = showPhIn(ci)}
      <div bind:this={colEls[ci]}>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:0 2px">
          <span style="width:8px;height:8px;border-radius:99px;background:{col.tone}"></span>
          <b style="font-size:12.5px">{col.name}</b>
          <span class="mono" style="font-size:11px;color:var(--text-faint)">{col.cards.length}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;min-height:64px">
          {#each items as card, i (card.id)}
            {#if showPh && target.index === i}
              <div
                style="border:1.6px dashed color-mix(in oklab, var(--accent) 50%, var(--border));background:color-mix(in oklab, var(--accent) 8%, transparent);border-radius:var(--r-md);height:56px"
              ></div>
            {/if}
            <div
              data-kcard
              class="card"
              role="button"
              tabindex="-1"
              style="padding:13px;cursor:grab;touch-action:none"
              onpointerdown={(e) => startDrag(e, card, ci)}
            >
              <div style="font-size:13px;font-weight:600;margin-bottom:9px;line-height:1.4">
                {card.title}
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <Badge tone={card.tone}>{card.tag}</Badge>
                <Avatar name="A Q" hue={250} size={22} />
              </div>
            </div>
          {/each}
          {#if showPh && target.index >= items.length}
            <div
              style="border:1.6px dashed color-mix(in oklab, var(--accent) 50%, var(--border));background:color-mix(in oklab, var(--accent) 8%, transparent);border-radius:var(--r-md);height:56px"
            ></div>
          {/if}
          {#if items.length === 0 && !showPh}
            <div
              style="border:1.5px dashed var(--border);border-radius:var(--r-sm);padding:18px 0;text-align:center;font-size:12px;color:var(--text-faint)"
            >
              Drop here
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  {#if drag}
    <div
      use:portal
      style="position:fixed;left:{pt.x - drag.offX}px;top:{pt.y -
        drag.offY}px;width:{drag.w}px;z-index:600;pointer-events:none;transform:rotate(2.5deg) scale(1.03);opacity:.96"
    >
      <div
        class="card"
        style="padding:13px;box-shadow:var(--shadow-lg);border-color:color-mix(in oklab, var(--accent) 40%, var(--border))"
      >
        <div style="font-size:13px;font-weight:600;margin-bottom:9px;line-height:1.4">
          {drag.card.title}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <Badge tone={drag.card.tone}>{drag.card.tag}</Badge>
          <Avatar name="A Q" hue={250} size={22} />
        </div>
      </div>
    </div>
  {/if}
</Block>
