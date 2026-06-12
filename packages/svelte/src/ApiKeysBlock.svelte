<script>
  import Block from './Block.svelte';
  import Tooltip from './Tooltip.svelte';
  import Icon from './Icon.svelte';
  import { toast } from './toast.svelte.js';
  import { untrack } from 'svelte';

  const DEFAULT_KEYS = [
    { id: 1, name: 'Production', token: 'vsp_live_8f2a…d91c', secret: 'vsp_live_8f2a39c4e7b1d91c', created: 'Jan 14, 2026', last: '2m ago' },
    { id: 2, name: 'Staging', token: 'vsp_test_4b7e…02fa', secret: 'vsp_test_4b7e1d9a55c302fa', created: 'Mar 02, 2026', last: '3d ago' },
    { id: 3, name: 'CI / CD', token: 'vsp_live_19cc…7a4b', secret: 'vsp_live_19cc8e2f0b6d7a4b', created: 'Apr 21, 2026', last: '12h ago' },
  ];

  let { keys: initial = DEFAULT_KEYS } = $props();
  let keys = $state(untrack(() => initial.map((k) => ({ ...k }))));
  let revealed = $state(new Set());

  function toggleReveal(id) {
    const n = new Set(revealed);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    revealed = n;
  }
  function revoke(id) {
    keys = keys.filter((y) => y.id !== id);
    toast({ tone: 'neg', title: 'Key revoked' });
  }
</script>

<Block title="API keys" desc="Reveal, copy, and revoke credentials. Secrets stay masked by default.">
  <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border)">
    <Icon name="bolt" size={17} />
    <b style="font-size:13.5px">Secret keys</b>
    <div style="flex:1"></div>
    <button
      type="button"
      class="btn btn-primary btn-sm"
      onclick={() => toast({ tone: 'pos', title: 'API key created' })}
    >
      <Icon name="plus" size={15} />Create key
    </button>
  </div>
  <div style="padding:14px;padding-top:4px;padding-bottom:4px">
    {#each keys as k (k.id)}
      {@const show = revealed.has(k.id)}
      <div class="ui-row">
        <div style="min-width:96px">
          <div style="font-weight:600;font-size:13.5px">{k.name}</div>
          <div class="eyebrow" style="margin-top:2px">{k.created}</div>
        </div>
        <code
          class="mono"
          style="flex:1;font-size:12.5px;color:var(--text-dim);background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:7px 11px;letter-spacing:.02em"
          >{show ? k.secret : k.token}</code
        >
        <Tooltip label={show ? 'Hide' : 'Reveal'}>
          <button
            type="button"
            class="vsp-icon-btn"
            style="width:34px;height:34px"
            aria-label={show ? 'Hide secret' : 'Reveal secret'}
            onclick={() => toggleReveal(k.id)}
          >
            <Icon name="eye" size={16} />
          </button>
        </Tooltip>
        <Tooltip label="Copy">
          <button
            type="button"
            class="vsp-icon-btn"
            style="width:34px;height:34px"
            aria-label="Copy secret"
            onclick={() => toast({ title: 'Copied to clipboard' })}
          >
            <Icon name="doc" size={16} />
          </button>
        </Tooltip>
        <span class="eyebrow" style="width:66px;text-align:right">{k.last}</span>
        <button type="button" class="btn btn-subtle btn-sm" onclick={() => revoke(k.id)}>Revoke</button>
      </div>
    {/each}
  </div>
</Block>
