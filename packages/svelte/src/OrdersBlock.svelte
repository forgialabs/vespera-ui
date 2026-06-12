<script>
  import Block from './Block.svelte';
  import Badge from './Badge.svelte';
  import Avatar from './Avatar.svelte';
  import Tabs from './Tabs.svelte';
  import DropdownMenu from './DropdownMenu.svelte';
  import Icon from './Icon.svelte';

  const ORDER_TONE = { fulfilled: 'pos', processing: 'info', pending: 'warn', refunded: 'neg' };
  const DEFAULT_ORDERS = [
    { id: 'ORD-90210', company: 'Northwind', hue: 220, item: 'Annual license', state: 'fulfilled', amount: 2400 },
    { id: 'ORD-90211', company: 'Halcyon', hue: 150, item: 'Seat add-on', state: 'processing', amount: 320 },
    { id: 'ORD-90212', company: 'Vertex', hue: 280, item: 'Pro upgrade', state: 'pending', amount: 980 },
    { id: 'ORD-90213', company: 'Cobalt', hue: 12, item: 'API overage', state: 'refunded', amount: 140 },
    { id: 'ORD-90214', company: 'Beacon', hue: 95, item: 'Support plan', state: 'fulfilled', amount: 3120 },
    { id: 'ORD-90215', company: 'Lumen', hue: 320, item: 'Onboarding', state: 'processing', amount: 1500 },
  ];
  const ROW_MENU = [
    { label: 'View order', icon: 'eye' },
    { label: 'Refund', icon: 'refresh' },
    { sep: true },
    { label: 'Cancel', icon: 'x', danger: true },
  ];

  let { orders = DEFAULT_ORDERS } = $props();

  let tab = $state('all');
  let sel = $state(new Set());

  let rows = $derived(orders.filter((o) => tab === 'all' || o.state === tab));
  let allSel = $derived(rows.length > 0 && rows.every((r) => sel.has(r.id)));

  function toggleAll() {
    const n = new Set(sel);
    if (allSel) rows.forEach((r) => n.delete(r.id));
    else rows.forEach((r) => n.add(r.id));
    sel = n;
  }
  function toggle(id) {
    const n = new Set(sel);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    sel = n;
  }
</script>

<Block
  title="Orders"
  desc="Operational table with tab filters, bulk selection, inline status and a row action menu."
>
  <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border)">
    <Tabs
      bind:value={tab}
      tabs={[
        { value: 'all', label: 'All', count: orders.length },
        { value: 'processing', label: 'Processing' },
        { value: 'pending', label: 'Pending' },
        { value: 'refunded', label: 'Refunded' },
      ]}
    />
    <div style="flex:1"></div>
    {#if sel.size > 0}
      <Badge tone="info">{sel.size} selected</Badge>
      <button type="button" class="btn btn-ghost btn-sm"><Icon name="download" size={15} />Export</button>
      <button type="button" class="btn btn-ghost btn-sm"><Icon name="check" size={15} />Fulfill</button>
    {:else}
      <button type="button" class="btn btn-ghost btn-sm"><Icon name="filter" size={15} />Filter</button>
      <button type="button" class="btn btn-primary btn-sm"><Icon name="plus" size={15} />New order</button>
    {/if}
  </div>
  <div style="overflow-x:auto">
    <table class="ui-table" style="min-width:720px">
      <thead>
        <tr>
          <th style="width:44px">
            <span
              class="ui-check{allSel ? ' on' : ''}"
              role="checkbox"
              aria-checked={allSel}
              tabindex="-1"
              onclick={toggleAll}
              onkeydown={(e) => e.key === 'Enter' && toggleAll()}
            >
              <Icon name="check" size={14} />
            </span>
          </th>
          <th><span class="eyebrow">Order</span></th>
          <th><span class="eyebrow">Customer</span></th>
          <th><span class="eyebrow">Item</span></th>
          <th><span class="eyebrow">Status</span></th>
          <th style="text-align:right"><span class="eyebrow">Amount</span></th>
          <th style="width:44px"></th>
        </tr>
      </thead>
      <tbody>
        {#each rows as o (o.id)}
          <tr
            style={sel.has(o.id)
              ? 'background:color-mix(in oklab, var(--accent) 7%, transparent)'
              : ''}
          >
            <td>
              <span
                class="ui-check{sel.has(o.id) ? ' on' : ''}"
                role="checkbox"
                aria-checked={sel.has(o.id)}
                tabindex="-1"
                onclick={() => toggle(o.id)}
                onkeydown={(e) => e.key === 'Enter' && toggle(o.id)}
              >
                <Icon name="check" size={14} />
              </span>
            </td>
            <td class="mono" style="font-weight:600">{o.id}</td>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <Avatar name={o.company} hue={o.hue} size={28} />
                <span style="font-weight:500">{o.company}</span>
              </div>
            </td>
            <td style="color:var(--text-dim)">{o.item}</td>
            <td><Badge tone={ORDER_TONE[o.state]} dot>{o.state}</Badge></td>
            <td class="tnum" style="text-align:right;font-weight:700">${o.amount.toLocaleString()}</td>
            <td>
              <DropdownMenu items={ROW_MENU}>
                {#snippet trigger()}
                  <button
                    type="button"
                    class="vsp-icon-btn"
                    style="width:30px;height:30px;border:0;background:transparent"
                    aria-label="Row actions"
                  >
                    <Icon name="more" size={18} />
                  </button>
                {/snippet}
              </DropdownMenu>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Block>
