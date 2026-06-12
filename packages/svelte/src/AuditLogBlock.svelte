<script>
  import Block from './Block.svelte';
  import Badge from './Badge.svelte';
  import Icon from './Icon.svelte';

  const DEFAULT_AUDIT = [
    { who: 'Avery Quinn', action: 'updated billing settings', tag: 'Settings', time: '2 min ago', icon: 'settings' },
    { who: 'Maya Okafor', action: 'upgraded to Enterprise', tag: 'Billing', time: '38 min ago', icon: 'arrowUp' },
    { who: 'System', action: 'rotated production API key', tag: 'Security', time: '1 hr ago', icon: 'shield' },
    { who: 'Leo Vega', action: 'invited 4 members', tag: 'Team', time: '3 hr ago', icon: 'users' },
    { who: 'Billing', action: 'flagged failed payment · Cobalt', tag: 'Billing', time: '5 hr ago', icon: 'bell' },
  ];

  let { entries = DEFAULT_AUDIT } = $props();
</script>

<Block title="Audit log" desc="A chronological trail of every privileged action.">
  <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border)">
    <Icon name="clock" size={17} />
    <b style="font-size:13.5px">Recent activity</b>
    <div style="flex:1"></div>
    <button type="button" class="btn btn-ghost btn-sm">
      <Icon name="download" size={15} />
      Export log
    </button>
  </div>
  <div style="padding:14px">
    <div style="position:relative;padding-left:8px">
      {#each entries as e, i (i)}
        <div
          style="display:flex;gap:14px;position:relative;padding-bottom:{i < entries.length - 1
            ? '20px'
            : '0'}"
        >
          {#if i < entries.length - 1}
            <span
              style="position:absolute;left:15px;top:32px;bottom:0;width:1.5px;background:var(--border)"
            ></span>
          {/if}
          <span
            style="width:32px;height:32px;border-radius:9px;flex-shrink:0;display:grid;place-items:center;background:var(--surface-3);border:1px solid var(--border);color:var(--text-dim);z-index:1"
          >
            <Icon name={e.icon} size={16} />
          </span>
          <div style="flex:1;padding-top:5px">
            <div style="font-size:13.5px">
              <b style="font-weight:700">{e.who}</b>
              <span style="color:var(--text-dim)">{e.action}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:5px">
              <Badge tone="muted">{e.tag}</Badge>
              <span class="eyebrow">{e.time}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</Block>
