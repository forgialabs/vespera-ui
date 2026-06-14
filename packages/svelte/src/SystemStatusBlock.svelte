<script>
  import Block from './Block.svelte';
  import Badge from './Badge.svelte';
  import BlockSkeleton from './BlockSkeleton.svelte';
  import BlockEmpty from './BlockEmpty.svelte';

  const STATUS_TONE = {
    operational: 'pos',
    degraded: 'warn',
    maintenance: 'info',
    down: 'neg',
  };
  const DEFAULT_SERVICES = [
    { name: 'API gateway', status: 'operational', uptime: 99.98 },
    { name: 'Database', status: 'operational', uptime: 99.95 },
    { name: 'Webhooks', status: 'degraded', uptime: 98.2 },
    { name: 'Auth service', status: 'operational', uptime: 100 },
    { name: 'Billing', status: 'maintenance', uptime: 99.8 },
  ];

  let { services = DEFAULT_SERVICES, loading = false, empty } = $props();

  let allOk = $derived(services.every((s) => s.status === 'operational'));
  let accent = $derived(allOk ? 'var(--success)' : 'var(--warning)');
  const bars = Array.from({ length: 44 }, (_, i) => i);
  const isBad = (s, i) =>
    (s.status === 'degraded' && i > 38 && i < 42) || (s.status === 'maintenance' && i === 43);
  const barBg = (s, i) =>
    isBad(s, i)
      ? s.status === 'degraded'
        ? 'var(--warning)'
        : 'var(--accent)'
      : 'color-mix(in oklab, var(--success) 70%, transparent)';
</script>

<Block title="System status" desc="Live service health with 30-day uptime bars.">
  <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border)">
    <span
      style="width:8px;height:8px;border-radius:99px;background:{accent};box-shadow:0 0 8px {accent}"
    ></span>
    <b style="font-size:13.5px">{allOk ? 'All systems operational' : 'Partial degradation'}</b>
    <div style="flex:1"></div>
    <span class="eyebrow">Updated 30s ago</span>
  </div>
  {#if loading}
    <BlockSkeleton />
  {:else if services.length === 0}
    {#if empty}{@render empty()}{:else}
      <BlockEmpty title="No services" desc="No monitored services yet." />
    {/if}
  {:else}
    <div style="padding:14px;padding-top:4px;padding-bottom:8px">
      {#each services as s (s.name)}
      <div class="ui-row" style="align-items:center">
        <div style="width:150px;flex-shrink:0">
          <div style="font-weight:600;font-size:13.5px">{s.name}</div>
        </div>
        <div style="flex:1;display:flex;gap:2px;align-items:flex-end;height:26px">
          {#each bars as i (i)}
            <span
              style="flex:1;height:{isBad(s, i) ? '60%' : '100%'};border-radius:2px;background:{barBg(
                s,
                i,
              )}"
            ></span>
          {/each}
        </div>
        <span
          class="mono tnum"
          style="width:56px;text-align:right;font-size:12px;color:var(--text-dim)">{s.uptime}%</span
        >
        <Badge tone={STATUS_TONE[s.status]} dot>{s.status}</Badge>
      </div>
      {/each}
    </div>
  {/if}
</Block>
